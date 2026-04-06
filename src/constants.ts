
export interface KnowledgePoint {
  id: string;
  title: string;
  grade: string;
  description: string;
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  color: string;
  points: KnowledgePoint[];
}

export const CURRICULUM_DATA: Module[] = [
  {
    id: 'calculation',
    title: '计算',
    icon: 'Calculator',
    color: 'bg-pink-100 text-pink-600 border-pink-200',
    points: [
      { id: 'c1', title: '20以内的进位加法', grade: '一年级上', description: '掌握凑十法，熟练计算20以内的进位加法。' },
      { id: 'c2', title: '两位数乘两位数', grade: '三年级下', description: '掌握两位数乘两位数的笔算方法。' },
      { id: 'c3', title: '分数加减法', grade: '五年级下', description: '异分母分数加减法的计算方法。' },
      { id: 'c4', title: '小数乘除法', grade: '五年级上', description: '掌握小数乘除法的计算法则。' },
      { id: 'c5', title: '解方程', grade: '五年级下', description: '理解等式的性质，学会解简易方程。' },
      { id: 'c6', title: '乘法分配律', grade: '四年级下', description: '掌握乘法分配律及其简便计算。' },
      { id: 'c7', title: '分数乘除法', grade: '六年级上', description: '掌握分数乘除法的计算方法。' },
    ]
  },
  {
    id: 'problem-solving',
    title: '解决问题',
    icon: 'Lightbulb',
    color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    points: [
      { id: 'p1', title: '简单的加减法应用题', grade: '一年级', description: '理解加减法的含义，解决简单的实际问题。' },
      { id: 'p2', title: '倍的认识与应用', grade: '三年级', description: '理解“倍”的含义，解决与倍有关的问题。' },
      { id: 'p3', title: '行程问题', grade: '四年级', description: '理解速度、时间、路程之间的关系。' },
      { id: 'p4', title: '百分数应用题', grade: '六年级', description: '解决求一个数是另一个数的百分之几等问题。' },
      { id: 'p5', title: '鸡兔同笼', grade: '六年级', description: '运用假设法或方程解决经典的逻辑问题。' },
      { id: 'p6', title: '比例的应用', grade: '六年级下', description: '掌握比例尺、按比例分配等应用。' },
    ]
  },
  {
    id: 'geometry',
    title: '几何',
    icon: 'Triangle',
    color: 'bg-green-100 text-green-600 border-green-200',
    points: [
      { id: 'g1', title: '认识图形（一）', grade: '一年级', description: '认识长方体、正方体、圆柱和球。' },
      { id: 'g2', title: '长方形和正方形的面积', grade: '三年级', description: '掌握面积单位及长方形、正方形面积计算。' },
      { id: 'g3', title: '圆的周长和面积', grade: '五年级', description: '理解圆周率，掌握圆的周长和面积公式。' },
      { id: 'g4', title: '圆柱与圆锥', grade: '六年级', description: '掌握圆柱表面积、体积及圆锥体积计算。' },
      { id: 'g5', title: '三角形的分类与内角和', grade: '四年级下', description: '认识三角形，掌握内角和180度。' },
    ]
  },
  {
    id: 'statistics',
    title: '统计概率',
    icon: 'BarChart3',
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    points: [
      { id: 's1', title: '分类与整理', grade: '一年级', description: '学会按单一标准或不同标准分类。' },
      { id: 's2', title: '条形统计图', grade: '四年级', description: '认识条形统计图，能根据数据绘制图表。' },
      { id: 's3', title: '折线统计图', grade: '五年级', description: '认识折线统计图，体会数据的变化趋势。' },
      { id: 's4', title: '可能性', grade: '五年级', description: '初步体验事件发生的等可能性。' },
    ]
  }
];
