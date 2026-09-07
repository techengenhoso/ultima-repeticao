import { readdir, readFile } from "node:fs/promises"
import { join, relative } from "node:path"

const root = process.cwd()
const sourceRoot = join(root, "src", "modules")
const sourceExtensions = new Set([".ts", ".tsx"])
const forbiddenPrefixes = [
  "firebase",
  "firebase-admin",
  "next",
  "react",
  "server-only",
  "@/infrastructure/",
]

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async entry => {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) return sourceFiles(path)
      return sourceExtensions.has(entry.name.slice(entry.name.lastIndexOf(".")))
        ? [path]
        : []
    })
  )
  return nested.flat()
}

function layerFor(path) {
  const segments = relative(sourceRoot, path).split(/[/\\]/u)
  return segments.includes("domain")
    ? "domain"
    : segments.includes("application")
      ? "application"
      : null
}

function isForbiddenSpecifier(specifier) {
  return (
    forbiddenPrefixes.some(
      prefix => specifier === prefix || specifier.startsWith(`${prefix}/`)
    ) ||
    /^@\/modules\/[^/]+\/infrastructure(?:\/|$)/u.test(specifier)
  )
}

function importsFrom(source) {
  return [...source.matchAll(/(?:from\s*|import\s*\()["']([^"']+)["']/gu)].map(
    match => match[1]
  )
}

const violations = []
for (const path of await sourceFiles(sourceRoot)) {
  const layer = layerFor(path)
  if (!layer) continue
  const source = await readFile(path, "utf8")
  for (const specifier of importsFrom(source)) {
    if (isForbiddenSpecifier(specifier))
      violations.push(`${relative(root, path)} (${layer}) importa ${specifier}`)
  }
}

if (violations.length) {
  console.error("Dependências de camada proibidas encontradas:\n")
  console.error(violations.join("\n"))
  process.exitCode = 1
} else {
  console.log("Arquitetura verificada: domain e application não importam framework ou infraestrutura")
}
