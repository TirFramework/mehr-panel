<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Admin Panel</title>
    @vite(['resources/admin/src/assets/index.css', 'resources/admin/src/main.jsx'])
</head>

<body>
    <div id="root"></div>

    <script src="{{ mix('/admin-assets/js/index.js') }}"></script>

</body>

</html>
