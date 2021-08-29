#!/usr/bin/env node
import * as cdk from 'monocdk';
import { BlepWkV2Stack } from '../lib/blep-wk-v2-stack';

const app = new cdk.App();
new BlepWkV2Stack(app, 'BlepWkV2Stack');
