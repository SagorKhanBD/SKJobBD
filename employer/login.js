<!DOCTYPE html>
<html lang="bn">

<head>

<meta charset="UTF-8">

<meta name="viewport"
content="width=device-width, initial-scale=1.0">

<title>
Employer Login | SK Job BD
</title>

<link rel="stylesheet"
href="login.css">

<link rel="preconnect"
href="https://fonts.googleapis.com">

<link rel="preconnect"
href="https://fonts.gstatic.com"
crossorigin>

<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap"
rel="stylesheet">

</head>

<body>

<header class="topHeader">

<div class="headerContainer">

<h1>SK Job BD</h1>

<p>
Employer & Institution Portal
</p>

</div>

</header>

<main class="loginContainer">

<div class="loginCard">

<div class="titleArea">

<h2>

নিয়োগকারী প্রতিষ্ঠান লগইন

</h2>

<p>

কোম্পানি • শিক্ষা প্রতিষ্ঠান • এনজিও • হাসপাতাল • ব্যাংক • সরকারি ও অন্যান্য প্রতিষ্ঠান

</p>

</div>

<form id="loginForm">

<div class="inputGroup">

<label>

মোবাইল নম্বর <span>*</span>

</label>

<input
type="text"
id="mobile"
maxlength="11"
placeholder="01XXXXXXXXX"
required>

</div>

<div class="inputGroup">

<label>

পাসওয়ার্ড <span>*</span>

</label>

<input
type="password"
id="password"
placeholder="আপনার পাসওয়ার্ড লিখুন"
required>

</div>

<div class="rememberArea">

<label>

<input
type="checkbox"
id="rememberMe">

আমাকে মনে রাখুন

</label>

</div>

<div
id="message"
class="messageBox">

</div>
<div class="buttonArea">

<button
type="submit"
class="loginBtn">

লগইন করুন

</button>

</div>

</form>

<div class="forgotArea">

<a href="forgot-password.html">

পাসওয়ার্ড ভুলে গেছেন?

</a>

</div>

<hr class="divider">

<div class="registerArea">

<p>

নতুন প্রতিষ্ঠান / কোম্পানি / শিক্ষা প্রতিষ্ঠান?

</p>

<a
href="register.html"
class="registerBtn">

নিবন্ধন করুন

</a>

</div>

<div class="homeArea">

<a
href="../index.html"
class="homeBtn">

← হোম পেজে ফিরে যান

</a>

</div>

</div>

</main>

<footer>

<div class="footerContainer">

<p>

© 2026 SK Job BD

</p>

<small>

Employer & Institution Portal

</small>

<br>

<small>

Powered by

<strong>

SK Job BD

</strong>

</small>

</div>

</footer>
<!-- =========================================
JavaScript
========================================= -->

<script type="module" src="login.js"></script>

</body>

</html>
