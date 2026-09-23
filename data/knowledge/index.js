// ============================================================
// MIND ATLAS — 知识内容聚合入口
// 静态导入 20 个领域的知识点文件，合并为 KNOWLEDGE map，
// 提供按知识点 id 查询完整 11 字段内容的工具函数。
// ============================================================

import { LOGIC_KNOWLEDGE } from './logic.js';
import { PHILOSOPHY_KNOWLEDGE } from './philosophy.js';
import { COGNITIVE_SCIENCE_KNOWLEDGE } from './cognitive-science.js';
import { COGNITIVE_BIASES_KNOWLEDGE } from './cognitive-biases.js';
import { SOCIAL_PSYCHOLOGY_KNOWLEDGE } from './social-psychology.js';
import { HUMAN_BEHAVIOR_KNOWLEDGE } from './human-behavior.js';
import { BEHAVIORAL_ECONOMICS_KNOWLEDGE } from './behavioral-economics.js';
import { GAME_THEORY_KNOWLEDGE } from './game-theory.js';
import { NEGOTIATION_KNOWLEDGE } from './negotiation.js';
import { ECONOMICS_KNOWLEDGE } from './economics.js';
import { POLITICS_KNOWLEDGE } from './politics.js';
import { STRATEGIC_THINKING_KNOWLEDGE } from './strategic-thinking.js';
import { SYSTEMS_THINKING_KNOWLEDGE } from './systems-thinking.js';
import { PROBLEM_SOLVING_KNOWLEDGE } from './problem-solving.js';
import { CREATIVITY_KNOWLEDGE } from './creativity.js';
import { RHETORIC_KNOWLEDGE } from './rhetoric.js';
import { INFORMATION_KNOWLEDGE } from './information.js';
import { PROBABILITY_KNOWLEDGE } from './probability.js';
import { LEARNING_KNOWLEDGE } from './learning.js';
import { GREAT_MINDS_KNOWLEDGE } from './great-minds.js';

// 合并所有领域为单一 map：id -> 11 字段内容对象
export const KNOWLEDGE = {
  ...LOGIC_KNOWLEDGE,
  ...PHILOSOPHY_KNOWLEDGE,
  ...COGNITIVE_SCIENCE_KNOWLEDGE,
  ...COGNITIVE_BIASES_KNOWLEDGE,
  ...SOCIAL_PSYCHOLOGY_KNOWLEDGE,
  ...HUMAN_BEHAVIOR_KNOWLEDGE,
  ...BEHAVIORAL_ECONOMICS_KNOWLEDGE,
  ...GAME_THEORY_KNOWLEDGE,
  ...NEGOTIATION_KNOWLEDGE,
  ...ECONOMICS_KNOWLEDGE,
  ...POLITICS_KNOWLEDGE,
  ...STRATEGIC_THINKING_KNOWLEDGE,
  ...SYSTEMS_THINKING_KNOWLEDGE,
  ...PROBLEM_SOLVING_KNOWLEDGE,
  ...CREATIVITY_KNOWLEDGE,
  ...RHETORIC_KNOWLEDGE,
  ...INFORMATION_KNOWLEDGE,
  ...PROBABILITY_KNOWLEDGE,
  ...LEARNING_KNOWLEDGE,
  ...GREAT_MINDS_KNOWLEDGE
};

// 按知识点 id 查询完整内容，找不到返回 null
export function getKnowledge(topicId) {
  return KNOWLEDGE[topicId] || null;
}
