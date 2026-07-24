const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5173';
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

const pages = [
  { url: '/', name: '01-landing' },
  { url: '/login', name: '02-login' },
  { url: '/employee', name: '03-employee-dashboard' },
  { url: '/mood', name: '04-mood-questions' },
  { url: '/points', name: '05-points-rewards' },
  { url: '/sessions', name: '06-sessions-calendar' },
  { url: '/notifications', name: '07-notifications' },
  { url: '/admin', name: '08-admin-dashboard' },
  { url: '/reports', name: '09-reports' },
  { url: '/analytics', name: '10-analytics' },
  { url: '/analytics-2', name: '11-analytics-compare' },
  { url: '/upload', name: '12-upload-files' },
  { url: '/signup', name: '13-signup' },
];

// Set mock auth before visiting protected pages
function getLocalStorageScript(role) {
  return `
    localStorage.setItem('mock_auth', JSON.stringify({ role: '${role}', userId: '${role === 'admin' ? 'admin' : 'emp1'}' }));
    localStorage.setItem('daily_mood_snapshot', '{}');
    window.location.reload();
  `;
}

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Find Chrome/Edge executable
  const possiblePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];

  let executablePath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      executablePath = p;
      break;
    }
  }

  if (!executablePath) {
    console.error('❌ Chrome/Edge not found. Please install Chrome.');
    process.exit(1);
  }

  console.log(`🔍 Found browser at: ${executablePath}`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const { url, name } of pages) {
    const fullUrl = `${BASE_URL}${url}`;
    const filePath = path.join(SCREENSHOTS_DIR, `${name}.png`);

    try {
      console.log(`📸 Capturing: ${fullUrl}`);

      // Handle auth-dependent pages
      if (url.startsWith('/employee') || url.startsWith('/mood') || url.startsWith('/points')) {
        // First set mock auth as employee, then navigate
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0', timeout: 15000 });
        await page.evaluate(() => {
          localStorage.setItem('mock_auth', JSON.stringify({ role: 'employee', userId: 'emp1' }));
        });
        await wait(500);
      } else if (url.startsWith('/admin') || url.startsWith('/reports') || url.startsWith('/analytics') || url.startsWith('/upload')) {
        await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0', timeout: 15000 });
        await page.evaluate(() => {
          localStorage.setItem('mock_auth', JSON.stringify({ role: 'admin', userId: 'admin' }));
        });
        await wait(500);
      }

      await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 20000 });
      await wait(2000); // Wait for animations and data loading

      await page.screenshot({
        path: filePath,
        fullPage: true,
      });

      console.log(`✅ Saved: ${name}.png`);
    } catch (err) {
      console.error(`❌ Failed to capture ${name}: ${err.message}`);
    }
  }

  await browser.close();
  console.log('\n🎉 All screenshots captured successfully!');
}

main().catch(console.error);

