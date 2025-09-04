#!/usr/bin/env node

/**
 * Test script to check Instantly API warmup endpoints
 * This will help us determine which endpoint format works
 */

const https = require('https');

// Replace with your actual API key
const API_KEY = process.env.INSTANTLY_API_KEY || 'your-api-key-here';
const TEST_EMAIL = 'brandoncharleson@onlinetopoffunnel.org';

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log(`Status: ${res.statusCode}`);
                console.log(`Response: ${body}`);
                resolve({ statusCode: res.statusCode, body });
            });
        });

        req.on('error', (error) => {
            console.error(`Request error: ${error.message}`);
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testWarmupEndpoints() {
    console.log('Testing Instantly API warmup endpoints...\n');

    // Test 1: Original body-based approach
    console.log('=== Test 1: Body-based approach ===');
    try {
        const options1 = {
            hostname: 'api.instantly.ai',
            path: '/api/v2/accounts/warmup/enable',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        await makeRequest(options1, { email: TEST_EMAIL });
    } catch (error) {
        console.error('Test 1 failed:', error.message);
    }

    console.log('\n=== Test 2: Path-based approach ===');
    try {
        const options2 = {
            hostname: 'api.instantly.ai',
            path: `/api/v2/accounts/${TEST_EMAIL}/warmup/enable`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        };
        await makeRequest(options2);
    } catch (error) {
        console.error('Test 2 failed:', error.message);
    }

    console.log('\n=== Test 3: Alternative endpoint pattern ===');
    try {
        const options3 = {
            hostname: 'api.instantly.ai',
            path: `/api/v2/accounts/${TEST_EMAIL}/enable-warmup`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        };
        await makeRequest(options3);
    } catch (error) {
        console.error('Test 3 failed:', error.message);
    }

    console.log('\n=== Test 4: Check if account exists ===');
    try {
        const options4 = {
            hostname: 'api.instantly.ai',
            path: `/api/v2/accounts/${TEST_EMAIL}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        };
        await makeRequest(options4);
    } catch (error) {
        console.error('Test 4 failed:', error.message);
    }

    console.log('\n=== Test 5: List all accounts ===');
    try {
        const options5 = {
            hostname: 'api.instantly.ai',
            path: '/api/v2/accounts?limit=5',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json'
            }
        };
        await makeRequest(options5);
    } catch (error) {
        console.error('Test 5 failed:', error.message);
    }
}

if (require.main === module) {
    if (!API_KEY || API_KEY === 'your-api-key-here') {
        console.error('Please set INSTANTLY_API_KEY environment variable');
        process.exit(1);
    }
    testWarmupEndpoints().catch(console.error);
}
