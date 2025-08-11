#!/usr/bin/env node

import inquirer from 'inquirer';
import { execa } from 'execa';

const apps = ['argus', 'shinigami'];
const frontendPorts = {
  argus: 3000,
  shinigami: 3000,
};
const backendPorts = {
  argus: 4000,
  shinigami: 4000,
};

const { app } = await inquirer.prompt([
  {
    type: 'list',
    name: 'app',
    message: 'Select an app to run:',
    choices: apps,
  },
]);

const { frontendPort } = await inquirer.prompt([
  {
    type: 'input',
    name: 'frontendPort',
    message: 'Select frontend port:',
    default: frontendPorts[app],
    validate: (input) => !isNaN(parseInt(input)) || 'Port must be a number',
  },
]);

const { runBackend } = await inquirer.prompt([
  {
    type: 'confirm',
    name: 'runBackend',
    message: 'Do you want to run the backend?',
    default: false,
  },
]);

let backendPort;
if (runBackend) {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'backendPort',
      message: 'Select backend port:',
      default: backendPorts[app],
      validate: (input) => !isNaN(parseInt(input)) || 'Port must be a number',
    },
  ]);
  backendPort = answer.backendPort;
}

console.log(`\nStarting ${app}...`);

const frontendCommand = [
  'workspace',
  `${app}-frontend`,
  'dev',
  '--port',
  frontendPort,
];

const backendCommand = ['workspace', `${app}-backend`, 'dev'];

const subprocesses = [];

subprocesses.push(execa('yarn', frontendCommand, { stdio: 'inherit' }));

if (runBackend) {
  subprocesses.push(
    execa('yarn', backendCommand, {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        PORT: backendPort.toString(),
      },
    })
  );
}

await Promise.all(subprocesses);
