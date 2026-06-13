import { test as base, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_USERS } from '../data/users';

/**
 * ログイン済みセッション用フィクスチャ
 */
export const test = base.extend<{
    premiumUserContext: BrowserContext;
    normalUserContext: BrowserContext;
    premiumUser2Context: BrowserContext;
    normalUser2Context: BrowserContext;
}>({
    /**
     * プレミアム会員（ichiro）ログイン済みのコンテキスト
     */
    premiumUserContext: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        // ログイン処理
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(TEST_USERS.PREMIUM_USER.email, TEST_USERS.PREMIUM_USER.password);

        // ストレージ状態を保存
        await context.storageState({ path: 'fixtures/premium-user.json' });

        await use(context);
        await context.close();
    },

    /**
     * 一般会員（sakura）ログイン済みのコンテキスト
     */
    normalUserContext: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        // ログイン処理
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(TEST_USERS.NORMAL_USER.email, TEST_USERS.NORMAL_USER.password);

        // ストレージ状態を保存
        await context.storageState({ path: 'fixtures/normal-user.json' });

        await use(context);
        await context.close();
    },

    /**
     * プレミアム会員（jun）ログイン済みのコンテキスト
     */
    premiumUser2Context: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        // ログイン処理
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(TEST_USERS.PREMIUM_USER_2.email, TEST_USERS.PREMIUM_USER_2.password);

        // ストレージ状態を保存
        await context.storageState({ path: 'fixtures/premium-user-2.json' });

        await use(context);
        await context.close();
    },

    /**
     * 一般会員（yoshiki）ログイン済みのコンテキスト
     */
    normalUser2Context: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        // ログイン処理
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(TEST_USERS.NORMAL_USER_2.email, TEST_USERS.NORMAL_USER_2.password);

        // ストレージ状態を保存
        await context.storageState({ path: 'fixtures/normal-user-2.json' });

        await use(context);
        await context.close();
    },
});

export { expect } from '@playwright/test';
