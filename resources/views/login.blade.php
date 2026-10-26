<!DOCTYPE html>
<html lang="en" data-theme="light" class="icons-ready">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sign in · Majlis Daerah Kuala Pilah</title>
    <link rel="icon" href="{{ asset('assets/mdkp-logo.png') }}">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&family=Manrope:wght@600;700;800&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,300..600,0..1,0&display=swap">
    <link rel="stylesheet" href="{{ asset('assets/neoeagle.css') }}">
    <link rel="stylesheet" href="{{ asset('assets/mdkp.css') }}">
</head>
<body class="login-body">
    <main class="login-shell"><section class="login-card">
        <div class="login-logo-panel"><img src="{{ asset('assets/mdkp-logo.png') }}" alt="Majlis Daerah Kuala Pilah crest" class="login-logo"></div>
        <div class="login-form-panel"><div class="login-form-heading login-form-heading--simple"><h1>Welcome back</h1><p>Sign in to continue to your dashboard.</p></div>
            <form method="POST" action="{{ route('login.store') }}" class="login-form" id="login-form">
                @csrf
                @if (session('status'))<p class="login-message" role="status">{{ session('status') }}</p>@endif
                @if ($errors->any())<p class="login-error" role="alert"><span class="material-symbols-rounded">error</span>{{ $errors->first() }}</p>@endif
                <label class="login-field" for="username"><span>Username</span><span class="login-input-wrap"><span class="material-symbols-rounded" aria-hidden="true">person</span><input id="username" aria-label="Username" name="username" type="text" autocomplete="username" placeholder="Enter your username" value="{{ old('username') }}" maxlength="100" required autofocus></span></label>
                <label class="login-field" for="password"><span>Password</span><span class="login-input-wrap"><span class="material-symbols-rounded" aria-hidden="true">lock</span><input id="password" aria-label="Password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" maxlength="255" required><button class="password-toggle" type="button" id="password-toggle" aria-label="Show password" aria-pressed="false"><span class="material-symbols-rounded">visibility</span></button></span></label>
                <label class="remember-control"><input name="remember" type="checkbox" value="1" @checked(old('remember'))><span>Remember me</span></label>
                <button class="login-submit" type="submit" id="sign-in-button"><span>Sign in</span><span class="material-symbols-rounded">arrow_forward</span></button>
            </form>
        </div>
    </section></main>
    <script src="{{ asset('assets/login.js') }}" defer></script>
</body>
</html>
