<!DOCTYPE html>
<html lang="en" data-theme="light" class="icons-ready">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" href="{{ asset('assets/mdkp-logo.png') }}">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&family=Manrope:wght@600;700;800&display=swap">
    @viteReactRefresh
    @vite('resources/js/app.tsx')
    <x-inertia::head />
</head>
<body>
    <x-inertia::app />
</body>
</html>
