<?php 
    session_start();
    
    // Pull all relevant session variables.
    $username = isset($_SESSION['username']) ? $_SESSION['username'] : "guest";
    $access = isset($_SESSION['access']) ? $_SESSION['access'] : "student";
    $progress_modules = isset($_SESSION['progress_modules']) ? json_encode($_SESSION['progress_modules']) : '{}';
    $progress_currents = isset($_SESSION['progress_currents']) ? json_encode($_SESSION['progress_currents']) : '{}';
    $progress_fulls = isset($_SESSION['progress_fulls']) ? json_encode($_SESSION['progress_fulls']) : '{}';
    
    // Make sure session variables related to progress are updated.
    $_POST['module'] = -1;
    $_POST['progress'] = -1;
    ob_start();
    require('../common/update_user_progress.php');
    ob_clean();
    
?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
    <?php include('../common/headers.php'); ?>
    <link rel="stylesheet" type="text/css" href="/stoichiometry.css"/>
    <link rel="stylesheet" type="text/css" href="/nomenclature.css"/>
    <link rel="stylesheet" type="text/css" href="/shells_session.css"/>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <?php include('load_pt.php'); ?>
    <script type="text/javascript" src="general_functions.js"></script>
    <script type="text/javascript" src="load_polyatomics.js"></script>
    <script type="text/javascript" src="load_common_covalents.js"></script>
    <script type="text/javascript" src="https://example.org/plugins/plotly/plotly.min.js"></script>
    <script type="text/javascript" src="https://example.org/plugins/mathjs/math.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript" src="https://example.org/plugins/touchpunch/jquery.ui.touch-punch.min.js"></script>
    
    <script>
        window.session_username = "<?php echo $username; ?>";
        window.session_access = "<?php echo $access; ?>";
        window.session_modules = JSON.parse("<?php echo $progress_modules; ?>");
        window.session_currents = JSON.parse("<?php echo $progress_currents; ?>");
        window.session_fulls = JSON.parse("<?php echo $progress_fulls; ?>");
        window.current_module = 0;
    </script>
</head>
<body>
    <!--<script>
        $('body').append('<div id="progress"><div id="progress_value"></div></div>');
        $('#progress_value').css('width',"0%");
    </script>
    <div id="session_container"></div>
    <script type="text/javascript" src="stoich_builder.js"></script>-->
    <script type="text/javascript" src="nomenclature_builder.js"></script>
    <script type="text/javascript" src="stoich_builder.js"></script>
    <script type="text/javascript" src="orbitals_builder.js"></script>
    <script type="text/javascript" src="generic_session_controller.js"></script>
    <script type="text/javascript" src="session_select_module.js"></script>
</body>
</html>