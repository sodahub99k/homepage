# soda homepage

同一 GitHub オーナー配下の soda プロジェクト（`.soda/meta.json` かつ `visible: true`）を一覧表示するポータルサイト。

## 開発

```bash
pnpm install
cp .env.example .env   # VITE_GITHUB_OWNER を設定
pnpm dev
```

## 初回公開

```bash
pnpm publish:github
```

`scripts/publish-github.sh` が public リポジトリ作成・push・Pages 有効化・About/topics 同期を行います。

## 更新

`main` へ push すると GitHub Actions が build & deploy します。

## 仕様

- owner は本番では `{owner}.github.io` の hostname から自動導出
- ローカル dev のみ `VITE_GITHUB_OWNER` で fallback
- homepage 自身は `visible: false` のため一覧に表示されない
