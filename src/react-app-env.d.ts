/// <reference types="react-scripts" />

// CSS 文件类型声明，支持副作用导入和模块导入两种方式
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
  // 支持副作用导入
  export {};
}

declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
  // 支持副作用导入
  export {};
}

declare module "*.less" {
  const content: { [className: string]: string };
  export default content;
  // 支持副作用导入
  export {};
}

declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.tiff";
