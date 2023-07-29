import 'dotenv/config'
import { chromium } from 'playwright-extra'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'

const RecaptchaOptions = {
  visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
  provider: {
    id: '2captcha',
    token: process.env.TWOCAPTCHA_API,
  },
}

chromium.use(RecaptchaPlugin(RecaptchaOptions))

chromium.launch({ headless: false }).then(async (browser) => {
  const page = await browser.newPage()
  await page.goto('https://login.knoxnews.com/PKNS-GUP/authenticate/', { waitUntil: 'networkidle'})
  await page.getByRole('textbox', { name: 'Account Username' }).click()
  await page.getByRole('textbox', { name: 'Account Username' }).type(process.env.NEWS_LOGIN)
  await page.waitForTimeout(3000)
  await page.getByRole('textbox', { name: 'Account Username' }).blur()
  await page.getByRole('textbox', { name: 'Enter Password' }).click()
  await page.getByRole('textbox', { name: 'Enter Password' }).type(process.env.NEWS_PASSWORD)
  await page.waitForTimeout(3000)
  await page.getByRole('button', { name: 'Sign In' }).click()

  await page.solveRecaptchas()

  await page.getByLabel('Hi, Michael').click()
  await page.getByRole('link', { name: 'eNewspaper' }).nth(1).click()
  await page.frameLocator('iframe[name="mainframe"]').frameLocator('iframe[name="mainframe"]').locator('#lightbox-close').click()
  await page.frameLocator('iframe[name="mainframe"]').frameLocator('iframe[name="mainframe"]').getByRole('link', { name: 'View thumbnail images of all pages in the publication. Download pages as PDF files. Pages' }).click()
  const downloadPromise = page.waitForEvent('download')
  await page.frameLocator('iframe[name="mainframe"]').frameLocator('iframe[name="mainframe"]').locator('#divph_0 div a').click()
  const download = await downloadPromise
  await download.path()
  await download.saveAs('A1.pdf');
  await browser.close()
});
