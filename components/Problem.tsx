'use client';

import { Problem } from '@/types/problem';
import React, { useEffect } from 'react';
import MdxLayout from './MdxLayout';
import Testcases from './Testcases';
import dynamic from 'next/dynamic';
import { ExecutionResult } from '@/types/executionResult';
import { Button } from './Button';

type Props = {
  result: Problem;
};

const DyanmicCodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false
});

export default function Problem({ result }: Props) {
  const [executionResult, setExecutionResult] = React.useState<ExecutionResult>({
    language: '',
    version: '',
    run: {
      stdout: '',
      stderr: '',
      code: 0,
      signal: '',
      output: ''
    }
  });
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  return (
    <div className="relative grid w-full md:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-lg bg-neutral-900 p-4">
        <h1 className="text-3xl font-bold">
          {result.lc_number}: {result.title[0].toUpperCase() + result.title.slice(1).toLowerCase()}
        </h1>
        <div
          className={`w-max rounded-xl bg-neutral-700 px-2 py-1 text-xs
          ${result.difficulty === 'easy' ? 'text-green-500' : result.difficulty === 'medium' ? 'text-yellow-500' : result.difficulty === 'hard' ? 'text-red-500' : 'text-gray-500'}
        `}
        >
          {result.difficulty[0].toUpperCase() + result.difficulty.slice(1).toLowerCase()}
        </div>
        <MdxLayout>{`${result.content.replaceAll('\\n', '\n')}`}</MdxLayout>
      </div>
      <div className="min-h-0 min-w-0 flex-1 rounded-lg md:row-span-2">
        <DyanmicCodeEditor
          functionName={result.function}
          params={result.params}
          testcases={JSON.parse(result.testcases)}
          setExecutionResult={setExecutionResult}
          setTabIndex={setTabIndex}
        />
      </div>
      <div className="flex h-[30vh] flex-col">
        <div className="flex flex-wrap items-center bg-neutral-900">
          {Array.from({ length: 3 }).map((_, index) => (
            <Button
              key={index}
              className={`rounded-none px-4 py-2 hover:cursor-pointer hover:bg-neutral-700 ${tabIndex === index ? 'bg-neutral-700' : ''}`}
              onClick={() => setTabIndex(index)}
            >
              {index === 0 ? 'Testcases' : index === 1 ? 'Output' : index === 2 ? 'Pilot' : ''}
            </Button>
          ))}
        </div>
        <div className="rounded-lg p-4">
          {tabIndex === 0 ? (
            <Testcases testcases={result.testcases} />
          ) : tabIndex === 1 && executionResult.language ? (
            <div className="flex h-full w-full flex-col gap-4">
              <div className="flex items-center gap-2">
                Language: {executionResult.language}, Version: {executionResult.version}
              </div>
              <div className="rounded-lg bg-neutral-700 p-2 font-mono">
                {formatStdOut(executionResult.run.stdout)}
              </div>
            </div>
          ) : tabIndex === 2 ? (
            <>ai</>
          ) : (
            <div>No output yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

const formatStdOut = (stdout: string) => {
  let theirPrint: string[] = [];
  let ourPrint: string[] = [];
  let result = stdout;
  result
    .replace(/Input:/g, '\nInput:')
    .replace(/Expected:/g, 'Expected:')
    .replace(/Got:/g, 'Got:')
    .trim();

  return result.split('\n').map((line, index) => {
    if (line.startsWith('Input:') || line.startsWith('Expected:') || line.startsWith('Got:')) {
      return (
        <span key={index}>
          {line}
          <br />
        </span>
      );
    }
    return <span key={index}>{line}</span>;
  });
};
