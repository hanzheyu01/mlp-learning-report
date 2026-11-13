# MLP 参数学习的实现与可视化

第二次作业：通用 MLP 实验报告。未提供指定课程原文，按通用前馈网络、反向传播与梯度下降实现。

## 运行

Node.js 18 或更新版本，无第三方依赖。

```sh
npm test
npm run experiment
```

将本目录通过静态 HTTP 服务或 GitHub Pages 托管，打开 index.html。不要直接双击 HTML（浏览器模块与 fetch 需要 HTTP）。

## 实验

- XOR 数据：x 在 [-1,1]² 均匀分布，异号为 1，同号为 0。
- 400 训练点 / 400 独立测试点，种子分别为 42 / 2026。
- 2→8→1，tanh 隐藏层、sigmoid 输出，33 参数，Xavier 初始化种子 7。
- 稳定二元交叉熵，全批量梯度下降，3000 轮。
- 学习率 0.03、0.3、1；同数据逻辑回归基线。
- 默认学习率 0.3：训练准确率 98.75%，测试准确率 97.50%。完整原始结果见 results.json。

## 文件

- mlp.js：前向传播、手写梯度、更新、数据生成与线性对照。
- experiment.mjs：独立运行实验，生成结果文件。
- verify.mjs：所有参数中心差分梯度检查、收敛和可复现性验证。
- index.html / app.js / style.css：中文报告、在线训练、损失和边界、参数热力图、JSON 导出及打印。

## 验证与局限

梯度中心差分 epsilon=1e-5，最大绝对误差 1.80e-11。测试集不参与更新。实验仅为单一无噪声合成任务和单个划分，不代表真实任务性能。网页学习率和结构可调；结果表固定来自命令行实验，不随交互改变。

参考：[Deep Learning, Chapter 6](https://www.deeplearningbook.org/contents/mlp.html)。
