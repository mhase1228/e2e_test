import { test, expect } from '../fixtures/pages';
import { TEST_USERS } from '../data/users';

/**
 * ログインテスト（TC-LOGIN）
 */
test.describe('ログイン機能', () => {
    /**
     * TC-LOGIN-01: 正常ログイン（プレミアム会員）
     */
    test('TC-LOGIN-01: 正常ログイン（プレミアム会員）', async ({ page, loginPage, navigation }) => {
        // Step 1: ログインページにアクセス
        await loginPage.goto();

        // Step 2: プレミアム会員の認証情報を入力
        await loginPage.fillEmail(TEST_USERS.PREMIUM_USER.email);
        await loginPage.fillPassword(TEST_USERS.PREMIUM_USER.password);

        // Step 3: ログインボタンをクリック
        await loginPage.clickLoginButton();

        // Expected: /ja/mypage.html に遷移
        await expect(page).toHaveURL(/mypage\.html/);

        // Expected: ログイン状態のナビゲーション要素が表示
        const isLoggedInNav = await navigation.isLoggedInNavigationDisplayed();
        expect(isLoggedInNav).toBe(true);

        // Expected: ログアウト状態のナビゲーション要素が非表示
        const isLoggedOutNav = await navigation.isLoggedOutNavigationDisplayed();
        expect(isLoggedOutNav).toBe(false);
    });

    /**
     * TC-LOGIN-02: 正常ログイン（一般会員）
     */
    test('TC-LOGIN-02: 正常ログイン（一般会員）', async ({ page, loginPage, navigation }) => {
        // Step 1: ログインページにアクセス
        await loginPage.goto();

        // Step 2: 一般会員の認証情報を入力
        await loginPage.fillEmail(TEST_USERS.NORMAL_USER.email);
        await loginPage.fillPassword(TEST_USERS.NORMAL_USER.password);

        // Step 3: ログインボタンをクリック
        await loginPage.clickLoginButton();

        // Expected: /ja/mypage.html に遷移
        await expect(page).toHaveURL(/mypage\.html/);

        // Expected: ログイン状態のナビゲーション要素が表示
        const isLoggedInNav = await navigation.isLoggedInNavigationDisplayed();
        expect(isLoggedInNav).toBe(true);
    });

    /**
     * TC-LOGIN-03: 存在しないメールアドレスでのログイン失敗
     */
    test('TC-LOGIN-03: 存在しないメールアドレスでのログイン失敗', async ({ page, loginPage }) => {
        // Step 1: ログインページにアクセス
        await loginPage.goto();

        // Step 2: 存在しないメールアドレスを入力
        await loginPage.fillEmail('notexist@example.com');
        await loginPage.fillPassword(TEST_USERS.PREMIUM_USER.password);

        // Step 3: ログインボタンをクリック
        await loginPage.clickLoginButton();

        // Expected: ログインページに留まる
        await expect(page).toHaveURL(/login\.html/);

        // Expected: ログイン失敗エラーメッセージが表示されるまで待機
        await loginPage.waitForLoginError();

        // Expected: エラーメッセージ内容を確認
        const errorMessage = await loginPage.getLoginErrorMessage();
        expect(errorMessage).toContain('メールアドレスまたはパスワードが違います');
    });

    /**
     * TC-LOGIN-04: 誤ったパスワードでのログイン失敗
     */
    test('TC-LOGIN-04: 誤ったパスワードでのログイン失敗', async ({ page, loginPage }) => {
        // Step 1: ログインページにアクセス
        await loginPage.goto();

        // Step 2: メールアドレスと誤ったパスワードを入力
        await loginPage.fillEmail(TEST_USERS.PREMIUM_USER.email);
        await loginPage.fillPassword('wrongpassword');

        // Step 3: ログインボタンをクリック
        await loginPage.clickLoginButton();

        // Expected: ログインページに留まる
        await expect(page).toHaveURL(/login\.html/);

        // Expected: ログイン失敗エラーメッセージが表示されるまで待機
        await loginPage.waitForLoginError();

        // Expected: エラーメッセージ内容を確認
        const errorMessage = await loginPage.getLoginErrorMessage();
        expect(errorMessage).toContain('メールアドレスまたはパスワードが違います');
    });

    /**
     * TC-LOGIN-05: メールアドレス未入力バリデーションエラー
     */
    test('TC-LOGIN-05: メールアドレス未入力バリデーションエラー', async ({ page, loginPage }) => {
        // Step 1: ログインページにアクセス
        await loginPage.goto();

        // Step 2: メールアドレスは入力しない、パスワードのみ入力
        await loginPage.fillPassword(TEST_USERS.PREMIUM_USER.password);

        // Step 3: ログインボタンをクリック
        await loginPage.clickLoginButton();

        // Expected: ログインページに留まる
        await expect(page).toHaveURL(/login\.html/);

        // Expected: メールアドレス欄にバリデーションエラーが表示されるまで待機
        await loginPage.waitForEmailErrorVisible();

        // Expected: エラーが表示されていることを確認
        const isErrorVisible = await loginPage.isEmailErrorVisible();
        expect(isErrorVisible).toBe(true);
    });

    /**
     * TC-LOGIN-06: パスワード未入力バリデーションエラー
     */
    test('TC-LOGIN-06: パスワード未入力バリデーションエラー', async ({ page, loginPage }) => {
        // Step 1: ログインページにアクセス
        await loginPage.goto();

        // Step 2: メールアドレスのみ入力、パスワードは入力しない
        await loginPage.fillEmail(TEST_USERS.PREMIUM_USER.email);

        // Step 3: ログインボタンをクリック
        await loginPage.clickLoginButton();

        // Expected: ログインページに留まる
        await expect(page).toHaveURL(/login\.html/);

        // Expected: パスワード欄にバリデーションエラーが表示されるまで待機
        await loginPage.waitForPasswordErrorVisible();

        // Expected: エラーが表示されていることを確認
        const isErrorVisible = await loginPage.isPasswordErrorVisible();
        expect(isErrorVisible).toBe(true);
    });

    /**
     * TC-LOGIN-07: ログアウト後のナビゲーション確認
     */
    test('TC-LOGIN-07: ログアウト後のナビゲーション確認', async ({ page, loginPage, navigation }) => {
        // Precondition: プレミアム会員でログイン
        // Step 1: ログインページにアクセス
        await loginPage.goto();

        // Step 2: プレミアム会員でログイン
        await loginPage.login(TEST_USERS.PREMIUM_USER.email, TEST_USERS.PREMIUM_USER.password);
        await expect(page).toHaveURL(/mypage\.html/);

        // Step 3: ナビゲーションからログアウトボタンをクリック
        await navigation.clickLogoutButton();

        // Expected: ログインページまたはトップページに遷移
        await expect(page).toHaveURL(/(?:login\.html|index\.html)/);

        // Expected: ログアウト状態のナビゲーション要素が表示
        const isLoggedOutNav = await navigation.isLoggedOutNavigationDisplayed();
        expect(isLoggedOutNav).toBe(true);

        // Expected: ログイン状態のナビゲーション要素が非表示
        const isLoggedInNav = await navigation.isLoggedInNavigationDisplayed();
        expect(isLoggedInNav).toBe(false);
    });
});
