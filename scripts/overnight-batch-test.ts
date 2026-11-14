// scripts/overnight-batch-test.ts
import fs from 'fs-extra';
import path from 'path';
import { MultiStepTrainer } from '../src/engines/training/MultiStepTrainer.ts';

interface BatchTestJob {
  archetype: string;
  compositionName: string;
  prompt: string;
}

const queue: BatchTestJob[] = [
  { archetype: 'saas', compositionName: 'SaaSGrowthReel', prompt: 'Modern SaaS analytics demo with brand icons and metric cards' },
  { archetype: 'tech', compositionName: 'LocalAiShort', prompt: 'The Death of Cloud Computing with glowing SVG flow lines' },
  { archetype: 'data', compositionName: 'NeuralWeightsVisualizer', prompt: 'Neural network weight matrices and tensor flow pipelines' },
  { archetype: 'abstract', compositionName: 'ParadoxOfFocus', prompt: 'Cinematic minimal educational short with dual-font typography' },
  { archetype: 'cinematic', compositionName: 'OneConversationFinale', prompt: '2:07 AM studio awakening short film with NLE timeline HUD' },
];

async function runOvernightBatch() {
  console.log(`🌙 [REA Overnight Batch Runner] Starting automated multi-archetype queue (${queue.length} jobs)...`);
  const reportDir = path.resolve(process.cwd(), 'reports');
  fs.ensureDirSync(reportDir);

  const results: any[] = [];

  for (const job of queue) {
    console.log(`\n--------------------------------------------------`);
    console.log(`▶️ Processing Job: [${job.archetype.toUpperCase()}] ${job.compositionName}`);
    const startTime = Date.now();

    try {
      // Execute 4-phase multi-step training loop for real composition verification
      const trainingResult = await MultiStepTrainer.executePipeline(job.compositionName, job.prompt);
      const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log(`✅ SUCCESS: ${job.compositionName} compiled and audited (Grade: ${trainingResult.finalGrade}, Time: ${durationSec}s)`);
      results.push({
        ...job,
        status: 'PASSED',
        grade: trainingResult.finalGrade,
        iterations: trainingResult.iterations,
        durationSeconds: durationSec,
      });
    } catch (err: any) {
      console.error(`❌ FAILED: ${job.compositionName} -> ${err.message}`);
      results.push({ ...job, status: 'FAILED', error: err.message });
    }
  }

  const reportPath = path.join(reportDir, `batch-report-${Date.now()}.json`);
  fs.writeJsonSync(reportPath, results, { spaces: 2 });
  console.log(`\n📊 Overnight Batch Complete! Summary report saved to: ${reportPath}`);
  return results;
}

runOvernightBatch();
