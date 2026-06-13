import { Page } from '@playwright/test';

/**
 * 共通ナビゲーションコンポーネント
 * 全ページで共通して表示される要素を管理
 */
export class Navigation {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * ログイン状態時のナビゲーション要素が表示されているか確認
     * （マイページリンク＋ログアウトボタン）
     */
    async isLoggedInNavigationDisplayed(): Promise<boolean> {
        // role属性がないため getByText を使用
        const mypageLink = this.page.getByText('マイページ').first();
        const logoutButton = this.page.getByText('ログアウト').first();

        const mypageVisible = await mypageLink.isVisible();
        const logoutVisible = await logoutButton.isVisible();

        return mypageVisible && logoutVisible;
    }

    /**
     * ログアウト状態時のナビゲーション要素が表示されているか確認
     * （会員登録リンク＋ログインボタン）
     */
    async isLoggedOutNavigationDisplayed(): Promise<boolean> {
        // role属性がないため getByText を使用
        const signupLink = this.page.getByText('会員登録').first();
        const loginButton = this.page.getByText('ログイン').first();

        const signupVisible = await signupLink.isVisible();
        const loginVisible = await loginButton.isVisible();

        return signupVisible && loginVisible;
    }

    /**
     * マイページリンクをクリック
     */
    async clickMypageLink() {
        await this.page.getByText('マイページ').first().click();
    }

    /**
     * 会員登録リンクをクリック
     */
    async clickSignupLink() {
        await this.page.getByText('会員登録').first().click();
    }

    /**
     * ログインボタンをクリック（ナビゲーション内）
     */
    async clickLoginButton() {
        await this.page.getByText('ログイン').first().click();
    }

    /**
     * ログアウトボタンをクリック（ナビゲーション内）
     */
    async clickLogoutButton() {
        await this.page.getByText('ログアウト').first().click();
    }
}
