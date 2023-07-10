import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  /Require cycle*/,
  /.*/,
])
Error.stackTraceLimit = 30;

console.log("...-------------------- APP INITIALIZING --------------------...");

import { loadRoutes } from "./app/js/views/Routes";
import { BackgroundProcessHandler } from "./app/js/backgroundProcesses/BackgroundProcessHandler";

import 'react-native-console-time-polyfill';

console.log("...\n\n\n\n-------------------- APP STARTING UP --------------------\n\n\n\n...");


loadRoutes();
BackgroundProcessHandler.start();

