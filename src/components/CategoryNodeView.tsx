import { useState } from 'preact/hooks';
import styles from './CategoryNodeView.module.css';

// Define the interface for the category node
interface CategoryNode {
  children: { [key: string]: CategoryNode };
  posts: any[];
  path: string;
  isLeaf: boolean;
}

interface Props {
  categoryName: string;
  categoryNode: CategoryNode;
  categoryCounts: { [key: string]: number };
  level?: number;
}

const CategoryNodeView = ({ 
  categoryName, 
  categoryNode, 
  categoryCounts, 
  level = 0 
}: Props) => {
  const hasChildren = Object.keys(categoryNode.children).length > 0;
  const hasPosts = categoryNode.posts && categoryNode.posts.length > 0;
  const isMainCategory = level === 0;
  
  // 使用 React 状态管理展开/收起状态
  const [isExpanded, setIsExpanded] = useState(true); // 默认展开

  const handleExpandClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.categoryGroup} ${styles[`level${level}`]}`}>
      {/* 类别标题 */}
      <div className={isMainCategory ? styles.mainCategory : styles.subCategory} data-category={categoryName}>
        <div className={styles.categoryHeader}>
          {(hasChildren || hasPosts) && (
            <button 
              className={styles.expandBtn} 
              aria-label="展开/收起"
              onClick={handleExpandClick}
            >
              <svg 
                className={styles.expandIcon} 
                width={isMainCategory ? "12" : "10"} 
                height={isMainCategory ? "12" : "10"} 
                viewBox="0 0 16 16"
                style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </button>
          )}
          <a href={`/categories/${encodeURIComponent(categoryNode.path)}`} className={styles.categoryLink}>
            {categoryName}
          </a>
          <span className={styles.postCount}>{categoryCounts[categoryNode.path] || 0}</span>
        </div>
      </div>
      
      {/* 子类别容器 */}
      {hasChildren && isExpanded && (
        <div 
          className={styles.subcategories} 
          data-parent={categoryName}
        >
          {Object.keys(categoryNode.children).map((subCategoryName: string) => (
            <CategoryNodeView 
              key={subCategoryName}
              categoryName={subCategoryName}
              categoryNode={categoryNode.children[subCategoryName]}
              categoryCounts={categoryCounts}
              level={level + 1}
            />
          ))}
        </div>
      )}
      
      {/* 当前类别下的直接文章 */}
      {hasPosts && isExpanded && (
        <div 
          className={`${styles.postsList} ${isMainCategory ? styles.mainPosts : ''}`}
        >
          {categoryNode.posts.map((post: any, index: number) => (
            <div key={post.url || index} className={styles.postItem}>
              <a href={post.url} className={styles.postLink}>
                {/* <span className={styles.postNumber}>{String(index + 1).padStart(2, '0')}:</span> */}
                <span className={styles.postTitle}>{post.frontmatter.title}</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryNodeView;