// 博客文章工具函数
export interface PostFrontmatter {
  title: string;
  pubDate: string;
  description: string;
  author: string;
  categories?: string[];
  tags?: string[];
  slug: string;
  draft?: boolean;
  image?: {
    url: string;
    alt: string;
  };
}

export interface Post {
  url: string;
  frontmatter: PostFrontmatter;
  Content: any;
}

// 类别树节点接口
export interface CategoryNode {
  children: { [key: string]: CategoryNode };
  posts: Post[];
  path: string;
  isLeaf: boolean;
}

// 获取所有文章
export function getAllPosts(): Post[] {
  const posts = Object.values(import.meta.glob('../pages/**/*.md', { eager: true })) as Post[];

  return posts
    .filter((post) => !post.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.pubDate).valueOf() - new Date(a.frontmatter.pubDate).valueOf()
    );
}

// 按年份分组文章
export function getPostsByYear(posts: Post[]) {
  const postsByYear: { [year: string]: Post[] } = {};

  posts.forEach((post) => {
    const year = new Date(post.frontmatter.pubDate).getFullYear().toString();
    if (!postsByYear[year]) {
      postsByYear[year] = [];
    }
    postsByYear[year].push(post);
  });

  return postsByYear;
}

// 按月份分组文章
export function getPostsByMonth(posts: Post[]) {
  const postsByMonth: { [key: string]: Post[] } = {};

  posts.forEach((post) => {
    const date = new Date(post.frontmatter.pubDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!postsByMonth[key]) {
      postsByMonth[key] = [];
    }
    postsByMonth[key].push(post);
  });

  return postsByMonth;
}

// 获取所有标签
export function getAllTags(posts: Post[]): string[] {
  const tags = posts.flatMap((post) => post.frontmatter.tags || []).filter(Boolean);

  return [...new Set(tags)].sort();
}

// 获取所有类别路径（扁平化）
export function getAllCategories(posts: Post[]): string[] {
  const categoryPaths = new Set<string>();
  posts.forEach((post) => {
    if (post.frontmatter.categories) {
      // 生成所有可能的路径
      for (let i = 1; i <= post.frontmatter.categories.length; i++) {
        const path = post.frontmatter.categories.slice(0, i).join('/');
        categoryPaths.add(path);
      }
    }
  });

  return Array.from(categoryPaths).sort();
}

// 构建完整的类别树结构，包含文章信息
export function buildCategoryTree(posts: Post[]): { [key: string]: CategoryNode } {
  const tree: { [key: string]: CategoryNode } = {};
  posts.forEach((post) => {
    if (post.frontmatter.categories && post.frontmatter.categories.length > 0) {
      let currentLevel = tree;

      // 遍历每个层级
      post.frontmatter.categories.forEach((category, index) => {
        if (!currentLevel[category]) {
          currentLevel[category] = {
            children: {},
            posts: [],
            path: post.frontmatter.categories!.slice(0, index + 1).join('/'),
            isLeaf: false,
          };
        }

        // 如果是最后一级，添加文章
        if (index === post.frontmatter.categories!.length - 1) {
          currentLevel[category].posts.push(post);
          currentLevel[category].isLeaf = true;
        }

        currentLevel = currentLevel[category].children;
      });
    }
  });

  return tree;
}

// 根据类别筛选文章
export function getPostsByCategory(posts: Post[], categoryPath: string): Post[] {
  return posts.filter((post) => {
    if (!post.frontmatter.categories) return false;

    // 检查是否匹配完整路径或者是其父路径
    for (let i = 1; i <= post.frontmatter.categories.length; i++) {
      const path = post.frontmatter.categories.slice(0, i).join('/');
      if (path === categoryPath) {
        return true;
      }
    }
    return false;
  });
}

// 根据标签筛选文章
export function getPostsByTag(posts: Post[], tag: string): Post[] {
  return posts.filter((post) => post.frontmatter.tags?.includes(tag));
}

// 格式化日期
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 生成文章 URL
export function generatePostUrl(pubDate: string, slug: string): string {
  const date = new Date(pubDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `/${year}/${month}/${day}/${slug}`;
}
