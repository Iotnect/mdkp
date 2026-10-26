<!DOCTYPE html>
<html lang="en" data-theme="light" class="icons-ready">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Majlis Daerah Kuala Pilah · Command overview</title>
    <link rel="icon" href="{{ asset('assets/mdkp-logo.png') }}">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&family=Manrope:wght@600;700;800&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..600,0..1,0&display=swap">
    <link rel="stylesheet" href="{{ asset('assets/neoeagle.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/mdkp.css') }}">
</head>
<body>
<div class="app-shell">
    <aside class="sidebar" id="sidebar">
        <a class="brand" href="#overview" aria-label="Majlis Daerah Kuala Pilah dashboard"><span class="brand-mark brand-mark--logo"><img src="{{ asset('assets/mdkp-logo.png') }}" alt="Majlis Daerah Kuala Pilah crest"></span><span><strong class="council-name">Majlis Daerah<br>Kuala Pilah</strong></span></a>
        <nav class="nav" aria-label="Primary navigation">
            <p class="nav-label">Workspace</p>
            <a class="nav-link active" href="#overview" data-page="overview"><span class="material-symbols-rounded">space_dashboard</span><span>Overview</span></a>
            <p class="nav-label">Monitoring</p>
            <a class="nav-link" href="#detections" data-page="detections"><span class="material-symbols-rounded">frame_inspect</span><span>Plate Detection</span><b class="nav-count" id="nav-detection-count">{{ $detections->count() }}</b></a>
            <a class="nav-link" href="#evidence" data-page="evidence"><span class="material-symbols-rounded">fact_check</span><span>Evidence Review</span><b class="nav-count amber" id="nav-pending-count">{{ $detections->where('status', 'Pending')->count() }}</b></a>
            <a class="nav-link" href="#cameras" data-page="cameras"><span class="material-symbols-rounded">videocam</span><span>Camera Monitoring</span></a>
            <a class="nav-link" href="#watchlist" data-page="watchlist"><span class="material-symbols-rounded">car_tag</span><span>Vehicle Watchlist</span></a>
            <p class="nav-label">Management</p>
            <a class="nav-link" href="#activity" data-page="activity"><span class="material-symbols-rounded">history</span><span>Review Activity</span></a>
            <a class="nav-link" href="#reports" data-page="reports"><span class="material-symbols-rounded">analytics</span><span>Reports</span></a>
            <a class="nav-link" href="#settings" data-page="settings"><span class="material-symbols-rounded">settings</span><span>Settings</span></a>
        </nav>
        <div class="system-card"><div class="system-card__head"><span>System health</span><span class="live-dot"></span></div><strong>Demo workspace operational</strong><div class="health-bar"><i></i></div><small>4 sample cameras · no live feeds</small></div>
        <form method="POST" action="{{ route('logout') }}">@csrf<button class="profile-mini" type="submit" title="Log out" aria-label="Sign out"><img class="avatar" src="{{ asset('assets/user-avatar.svg') }}" alt="User profile"><span><strong>Admin</strong><small>Enforcement Officer</small></span><span class="material-symbols-rounded">logout</span></button></form>
    </aside>
    <div class="workspace">
        <header class="topbar"><button class="icon-button mobile-menu" id="menuToggle" aria-label="Toggle menu" aria-expanded="false"><span class="material-symbols-rounded">menu</span></button><div class="topbar-title"><span class="eyebrow">MDKP · Kuala Pilah</span><strong id="headerTitle">Command overview</strong></div><div class="topbar-actions"><div class="shift-chip"><span class="live-dot"></span><span><small>Demo snapshot</small><strong>23 Oct · 10:42 MYT</strong></span></div><button class="icon-button notification-button" aria-label="Notifications"><span class="material-symbols-rounded">notifications</span><i id="notification-count">4</i></button><span class="date-chip" id="currentDate"></span></div></header>
        <main id="app" tabindex="-1"></main>
    </div>
</div>
<dialog class="incident-modal" id="evidence-dialog" aria-labelledby="detail-title"><button class="icon-button modal-close" id="close-dialog" aria-label="Close evidence"><span class="material-symbols-rounded">close</span></button><div class="modal-inner"><div class="modal-title-row"><span class="monitor-icon"><span class="material-symbols-rounded">frame_inspect</span></span><div><h2 id="detail-title"></h2><p>Plate detection · supporting evidence</p></div></div><div class="detail-grid"><div class="evidence"><img class="evidence-image" src="{{ asset('assets/vehicle-demo.jpg') }}" alt="Illustrative vehicle photograph, not actual camera evidence"><div class="evidence-overlay"><div class="evidence-tags"><span>DEMO IMAGE</span><span id="evidence-camera"></span></div><div class="ocr-frame"><span>PLATE RECOGNITION SAMPLE</span><strong id="evidence-plate"></strong></div><span>Illustrative preview · no live OCR connected</span></div></div><div class="detail-stack"><div class="detail-block"><h3>Detection details</h3><div class="detail-list" id="detail-list"></div></div><div class="detail-block"><h3><label for="review-notes">Review notes</label></h3><textarea class="field notes" id="review-notes" maxlength="2000" placeholder="Add your review notes..."></textarea></div></div></div><p class="review-error" id="review-error" role="alert"></p><div class="modal-actions"><button class="button primary" id="verify-record"><span class="material-symbols-rounded">verified</span>Verify & save evidence</button><button class="button danger" id="dismiss-record"><span class="material-symbols-rounded">block</span>Dismiss detection</button></div></div></dialog>
<div class="notifications-popover panel" id="notification-panel" hidden><div class="panel-head"><h2>Recent alerts</h2><button class="icon-button" aria-label="Close notifications" data-action="close-notifications"><span class="material-symbols-rounded">close</span></button></div><div class="activity-list" id="notification-content"></div></div>
<div class="toast" id="toast" role="status"><span class="material-symbols-rounded">check_circle</span><span id="toast-message"></span></div>
<script>window.dashboardData = {{ Illuminate\Support\Js::from($detections) }}; window.dashboardUrls = {{ Illuminate\Support\Js::from($detections->mapWithKeys(fn ($detection) => [$detection->id => route('detections.update', $detection)])) }};</script>
<script src="{{ asset('assets/dashboard.js') }}" defer></script>
</body>
</html>
