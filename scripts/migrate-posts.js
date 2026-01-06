#!/usr/bin/env node

/**
 * 文章迁移脚本
 * 将现有的文章从 src/pages/posts/ 迁移到新的日期结构 src/pages/YYYY/MM/DD/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POSTS_DIR = path.join(__dirname, '../src/pages/posts');
const PAGES_DIR = path.join(__dirname, '../src/pages');

// 解析 frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    throw new Error('Invalid frontmatter format');
  }

  const frontmatter = {};
  const frontmatterContent = match[1];
  const bodyContent = match[2];

  // 简单的 YAML 解析（仅支持基本格式）
  const lines = frontmatterContent.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line
        .substring(colonIndex + 1)
        .trim()
        .replace(/^['"]|['"]$/g, '');
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body: bodyContent };
}

// 生成新的文件路径
function generateNewPath(pubDate, slug) {
  const date = new Date(pubDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return path.join(PAGES_DIR, year.toString(), month, day, `${slug}.md`);
}

// 更新 layout 路径
function updateLayoutPath(frontmatter, depth) {
  const layoutPath = frontmatter.layout;
  if (layoutPath && layoutPath.startsWith('../../layouts/')) {
    // 从 ../../layouts/ 更新为 ../../../../layouts/
    frontmatter.layout = '../../../../layouts/' + layoutPath.replace('../../layouts/', '');
  }
  return frontmatter;
}

// 迁移单个文件
function migratePost(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    // 检查必要字段
    if (!frontmatter.pubDate || !frontmatter.slug) {
      console.warn(`跳过文件 ${filePath}: 缺少 pubDate 或 slug 字段`);
      return;
    }

    // 更新 layout 路径
    updateLayoutPath(frontmatter, 4);

    // 生成新路径
    const newPath = generateNewPath(frontmatter.pubDate, frontmatter.slug);

    // 创建目录
    const newDir = path.dirname(newPath);
    fs.mkdirSync(newDir, { recursive: true });

    // 重新构建文件内容
    const newFrontmatter = Object.entries(frontmatter)
      .map(
        ([key, value]) =>
          `${key}: ${typeof value === 'string' && value.includes(' ') ? `'${value}'` : value}`
      )
      .join('\n');

    const newContent = `---\n${newFrontmatter}\n---\n${body}`;

    // 写入新文件
    fs.writeFileSync(newPath, newContent);

    console.log(`✅ 迁移成功: ${path.basename(filePath)} -> ${path.relative(PAGES_DIR, newPath)}`);

    // 删除原文件
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(`❌ 迁移失败 ${filePath}:`, error.message);
  }
}

// 主函数
function main() {
  console.log('🚀 开始迁移文章...\n');

  if (!fs.existsSync(POSTS_DIR)) {
    console.log('📁 posts 目录不存在，无需迁移');
    return;
  }

  const files = fs.readdirSync(POSTS_DIR);
  const markdownFiles = files.filter((file) => file.endsWith('.md'));

  if (markdownFiles.length === 0) {
    console.log('📄 没有找到需要迁移的 Markdown 文件');
    return;
  }

  console.log(`📄 找到 ${markdownFiles.length} 个文件需要迁移:\n`);

  for (const file of markdownFiles) {
    const filePath = path.join(POSTS_DIR, file);
    migratePost(filePath);
  }

  // 检查 posts 目录是否为空，如果为空则删除
  const remainingFiles = fs.readdirSync(POSTS_DIR);
  if (remainingFiles.length === 0) {
    fs.rmdirSync(POSTS_DIR);
    console.log('\n🗑️  已删除空的 posts 目录');
  }

  console.log('\n✨ 迁移完成！');
  console.log('\n📝 请检查迁移后的文章是否正确，并更新相关的导入路径。');
}

main();
