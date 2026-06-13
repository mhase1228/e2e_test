import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { PlansPage } from '../pages/PlansPage';
import { ReservePage } from '../pages/ReservePage';
import { ReserveConfirmPage } from '../pages/ReserveConfirmPage';
import { MyPage } from '../pages/MyPage';
import { Navigation } from '../pages/Navigation';

/**
 * Page Object を使用するためのフィクスチャを定義
 */
export const test = base.extend<{
    loginPage: LoginPage;
    signupPage: SignupPage;
    plansPage: PlansPage;
    reservePage: ReservePage;
    reserveConfirmPage: ReserveConfirmPage;
    myPage: MyPage;
    navigation: Navigation;
}>({
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    signupPage: async ({ page }, use) => {
        const signupPage = new SignupPage(page);
        await use(signupPage);
    },

    plansPage: async ({ page }, use) => {
        const plansPage = new PlansPage(page);
        await use(plansPage);
    },

    reservePage: async ({ page }, use) => {
        const reservePage = new ReservePage(page);
        await use(reservePage);
    },

    reserveConfirmPage: async ({ page }, use) => {
        const reserveConfirmPage = new ReserveConfirmPage(page);
        await use(reserveConfirmPage);
    },

    myPage: async ({ page }, use) => {
        const myPage = new MyPage(page);
        await use(myPage);
    },

    navigation: async ({ page }, use) => {
        const navigation = new Navigation(page);
        await use(navigation);
    },
});

export { expect } from '@playwright/test';
