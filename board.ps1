# board.ps1 - labels du projet + tickets du sprint 1
$labels = @(
    @{ name = "P0";        color = "b60205"; desc = "Bloquant - sprint en cours" },
    @{ name = "P1";        color = "d93f0b"; desc = "Important - ce cycle" },
    @{ name = "P2";        color = "fbca04"; desc = "Secondaire - backlog" },
    @{ name = "on-chain";  color = "1d76db"; desc = "Programme Anchor / Solana" },
    @{ name = "off-chain"; color = "5319e7"; desc = "Services TS partages (packages/core)" },
    @{ name = "frontend";  color = "0e8a16"; desc = "Dashboard Next.js" }
)

foreach ($l in $labels) {
    gh label create $l.name --color $l.color --description $l.desc
    if ($LASTEXITCODE -ne 0) { Write-Host "-> label '$($l.name)' : deja existant, ignore" -ForegroundColor Yellow }
}

gh issue create --title "feat(contracts): Scaffold du workspace Anchor" --body "Anchor.toml, lib.rs squelette, struct LaunchManifest (burn_bps, charity_bps, protocol_fee_bps, hard_cap, min_raise, dev_allocation_bps, duration_seconds), codes d'erreur de plage. Package: packages/contracts" --label "P0,on-chain"

gh issue create --title "feat(core): Types partages LaunchManifest + validation bps" --body "Types TypeScript miroir du compte on-chain, garde-fous sur les basis points (0-10000), helpers de conversion bps vers pourcentage pour l'UI. Package: packages/core" --label "P0,off-chain"

gh issue create --title "feat(ui): Scaffold Next.js dashboard" --body "create-next-app dans packages/frontend, Tailwind, layout de base avec en-tete GlassPad, page d'accueil listant les lancements" --label "P1,frontend"

$urls = gh issue list --limit 10 --json url --jq ".[].url"
foreach ($u in $urls) { gh project item-add 1 --owner watatcho --url $u }

Write-Host ""
Write-Host "Board pret : https://github.com/watatcho/glasspad/issues" -ForegroundColor Green