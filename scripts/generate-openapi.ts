#!/usr/bin/env node

import * as fs from "fs"
import * as path from "path"
import * as yaml from "js-yaml"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

interface RouteInfo {
  method: string
  path: string
  handler: string
  summary?: string
  description?: string
  tags?: string[]
  parameters?: any[]
  requestBody?: any
  responses?: any
}

class OpenAPIGenerator {
  private routes: RouteInfo[] = []
  private schemas: any = {}

  async generateFromCode() {
    console.log("🔍 Analyzing Lambda functions...")

    // Lambda関数からルート情報を抽出
    await this.extractRoutesFromLambda()

    // TypeScript型定義からスキーマを生成
    await this.generateSchemasFromTypes()

    // OpenAPI仕様書を生成
    const openApiSpec = this.buildOpenAPISpec()

    // YAML形式で保存
    const yamlContent = yaml.dump(openApiSpec, { indent: 2 })
    fs.writeFileSync("openapi-generated.yml", yamlContent)

    console.log("✅ OpenAPI specification generated: openapi-generated.yml")

    // HTML ドキュメントを生成
    await this.generateHTMLDocs()
  }

  private async extractRoutesFromLambda() {
    const lambdaDir = path.join(__dirname, "../lambda/api")
    const indexFile = path.join(lambdaDir, "index.ts")

    if (!fs.existsSync(indexFile)) {
      console.warn("⚠️ Lambda API file not found")
      return
    }

    const content = fs.readFileSync(indexFile, "utf-8")

    // switch文からルートを抽出
    const routeMatches = content.match(/case '(GET|POST|PUT|DELETE) (.+?)':/g)

    if (routeMatches) {
      routeMatches.forEach((match) => {
        const [, method, path] = match.match(/case '(GET|POST|PUT|DELETE) (.+?)':/) || []
        if (method && path) {
          this.routes.push({
            method: method.toLowerCase(),
            path: path.replace(/\{(\w+)\}/g, "{$1}"), // パラメータ形式を統一
            handler: `handle${this.toPascalCase(method)}${this.pathToHandlerName(path)}`,
            tags: [this.getTagFromPath(path)],
            summary: this.generateSummary(method, path),
          })
        }
      })
    }
  }

  private async generateSchemasFromTypes() {
    const typesDir = path.join(__dirname, "../types")

    if (!fs.existsSync(typesDir)) {
      console.warn("⚠️ Types directory not found")
      return
    }

    // TypeScript型定義ファイルを読み込み
    const typeFiles = fs.readdirSync(typesDir).filter((file) => file.endsWith(".ts"))

    for (const file of typeFiles) {
      const filePath = path.join(typesDir, file)
      const content = fs.readFileSync(filePath, "utf-8")

      // インターフェース定義を抽出
      const interfaceMatches = content.match(/export interface (\w+) \{([^}]+)\}/g)

      if (interfaceMatches) {
        interfaceMatches.forEach((match) => {
          const [, interfaceName, body] = match.match(/export interface (\w+) \{([^}]+)\}/) || []
          if (interfaceName && body) {
            this.schemas[interfaceName] = this.parseInterfaceToSchema(body)
          }
        })
      }
    }
  }

  private parseInterfaceToSchema(interfaceBody: string): any {
    const properties: any = {}
    const required: string[] = []

    const lines = interfaceBody
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line)

    lines.forEach((line) => {
      const match = line.match(/(\w+)(\?)?:\s*(.+);?/)
      if (match) {
        const [, propName, optional, propType] = match

        if (!optional) {
          required.push(propName)
        }

        properties[propName] = this.typeScriptTypeToOpenAPIType(propType)
      }
    })

    return {
      type: "object",
      properties,
      ...(required.length > 0 && { required }),
    }
  }

  private typeScriptTypeToOpenAPIType(tsType: string): any {
    const cleanType = tsType.trim().replace(/;$/, "")

    switch (cleanType) {
      case "string":
        return { type: "string" }
      case "number":
        return { type: "number" }
      case "boolean":
        return { type: "boolean" }
      case "Date":
        return { type: "string", format: "date-time" }
      default:
        if (cleanType.endsWith("[]")) {
          const itemType = cleanType.slice(0, -2)
          return {
            type: "array",
            items: this.typeScriptTypeToOpenAPIType(itemType),
          }
        }
        if (cleanType.includes("|")) {
          const types = cleanType.split("|").map((t) => t.trim())
          return { oneOf: types.map((t) => this.typeScriptTypeToOpenAPIType(t)) }
        }
        return { $ref: `#/components/schemas/${cleanType}` }
    }
  }

  private buildOpenAPISpec(): any {
    return {
      openapi: "3.0.3",
      info: {
        title: "Spoon配信サポートAPI",
        description: "Spoon配信者向けの配信活動支援ツールAPI（自動生成）",
        version: "1.0.0",
        contact: {
          name: "API Support",
          email: "support@example.com",
        },
      },
      servers: [
        {
          url: "https://api.spoon-support.com/v1",
          description: "Production server",
        },
      ],
      paths: this.buildPaths(),
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: this.schemas,
      },
    }
  }

  private buildPaths(): any {
    const paths: any = {}

    this.routes.forEach((route) => {
      if (!paths[route.path]) {
        paths[route.path] = {}
      }

      paths[route.path][route.method] = {
        tags: route.tags,
        summary: route.summary,
        security: route.path.includes("/auth/") ? [] : [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      }

      // パラメータを追加
      if (route.path.includes("{")) {
        const params = route.path.match(/\{(\w+)\}/g)
        if (params) {
          paths[route.path][route.method].parameters = params.map((param) => ({
            name: param.slice(1, -1),
            in: "path",
            required: true,
            schema: { type: "string" },
          }))
        }
      }
    })

    return paths
  }

  private async generateHTMLDocs() {
    try {
      // Swagger UIを使用してHTMLドキュメントを生成
      await execAsync("npx swagger-ui-dist-cli -f openapi-generated.yml -d docs/")
      console.log("✅ HTML documentation generated in docs/ directory")
    } catch (error) {
      console.warn("⚠️ Could not generate HTML docs:", error)
    }
  }

  private toPascalCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  private pathToHandlerName(path: string): string {
    return path
      .split("/")
      .filter((segment) => segment && !segment.startsWith("{"))
      .map((segment) => this.toPascalCase(segment))
      .join("")
  }

  private getTagFromPath(path: string): string {
    const segments = path.split("/").filter((segment) => segment)
    if (segments.length > 1) {
      return this.toPascalCase(segments[1])
    }
    return "General"
  }

  private generateSummary(method: string, path: string): string {
    const action = method.toLowerCase()
    const resource = this.getTagFromPath(path)

    const actionMap: { [key: string]: string } = {
      get: "取得",
      post: "作成",
      put: "更新",
      delete: "削除",
    }

    return `${resource}${actionMap[action] || action}`
  }
}

// コード生成機能
class CodeGenerator {
  async generateFromOpenAPI(specFile: string) {
    console.log("🔧 Generating code from OpenAPI specification...")

    const spec = yaml.load(fs.readFileSync(specFile, "utf-8")) as any

    // TypeScript型定義を生成
    await this.generateTypeScriptTypes(spec)

    // Lambda関数のスケルトンを生成
    await this.generateLambdaHandlers(spec)

    console.log("✅ Code generation completed")
  }

  private async generateTypeScriptTypes(spec: any) {
    let typesContent = "// Auto-generated TypeScript types from OpenAPI specification\n\n"

    if (spec.components?.schemas) {
      Object.entries(spec.components.schemas).forEach(([name, schema]: [string, any]) => {
        typesContent += this.schemaToTypeScript(name, schema)
        typesContent += "\n\n"
      })
    }

    fs.writeFileSync("generated-types.ts", typesContent)
    console.log("✅ TypeScript types generated: generated-types.ts")
  }

  private schemaToTypeScript(name: string, schema: any): string {
    if (schema.type === "object" && schema.properties) {
      let interfaceContent = `export interface ${name} {\n`

      Object.entries(schema.properties).forEach(([propName, propSchema]: [string, any]) => {
        const optional = !schema.required?.includes(propName) ? "?" : ""
        const propType = this.openAPITypeToTypeScript(propSchema)
        interfaceContent += `  ${propName}${optional}: ${propType};\n`
      })

      interfaceContent += "}"
      return interfaceContent
    }

    return `export type ${name} = ${this.openAPITypeToTypeScript(schema)};`
  }

  private openAPITypeToTypeScript(schema: any): string {
    if (schema.$ref) {
      return schema.$ref.split("/").pop()
    }

    switch (schema.type) {
      case "string":
        if (schema.enum) {
          return schema.enum.map((v: string) => `'${v}'`).join(" | ")
        }
        return "string"
      case "number":
      case "integer":
        return "number"
      case "boolean":
        return "boolean"
      case "array":
        return `${this.openAPITypeToTypeScript(schema.items)}[]`
      case "object":
        return "any" // 詳細な型定義が必要な場合は別途処理
      default:
        return "any"
    }
  }

  private async generateLambdaHandlers(spec: any) {
    // Lambda関数のハンドラースケルトンを生成
    let handlersContent = "// Auto-generated Lambda handlers from OpenAPI specification\n\n"
    handlersContent += 'import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";\n\n'

    if (spec.paths) {
      Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
        Object.entries(methods).forEach(([method, operation]: [string, any]) => {
          const handlerName = this.generateHandlerName(method, path)
          handlersContent += this.generateHandlerFunction(handlerName, operation)
          handlersContent += "\n\n"
        })
      })
    }

    fs.writeFileSync("generated-handlers.ts", handlersContent)
    console.log("✅ Lambda handlers generated: generated-handlers.ts")
  }

  private generateHandlerName(method: string, path: string): string {
    const segments = path.split("/").filter((segment) => segment && !segment.startsWith("{"))
    const resource = segments.join("")
    return `handle${method.toUpperCase()}${resource}`
  }

  private generateHandlerFunction(handlerName: string, operation: any): string {
    return `async function ${handlerName}(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  // TODO: Implement ${operation.summary || handlerName}
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'Not implemented yet',
      operation: '${operation.summary || handlerName}',
    }),
  };
}`
  }
}

// CLI実行
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command === "generate") {
    const generator = new OpenAPIGenerator()
    await generator.generateFromCode()
  } else if (command === "code") {
    const specFile = args[1]
    const codeGenerator = new CodeGenerator()
    await codeGenerator.generateFromOpenAPI(specFile)
  } else {
    console.log("Usage: node generate-openapi.ts generate | code <spec-file>")
  }
}

main().catch((error) => {
  console.error("Error executing script:", error)
})
