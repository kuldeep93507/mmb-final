<?php
// दियत (Diat) - PHP Application
// Created on: <?php echo date('Y-m-d H:i:s'); ?>

?>
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diat - PHP Application</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        h1 {
            color: #764ba2;
            text-align: center;
            margin-bottom: 30px;
        }
        .info-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .php-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .info-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        .info-label {
            font-weight: bold;
            color: #495057;
            margin-bottom: 5px;
        }
        .info-value {
            color: #667eea;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Diat - PHP Application</h1>
        
        <div class="info-card">
            <h2>✅ PHP Environment Successfully Setup!</h2>
            <p>आपका PHP environment तैयार है और चल रहा है।</p>
        </div>

        <div class="php-info">
            <div class="info-item">
                <div class="info-label">PHP Version</div>
                <div class="info-value"><?php echo PHP_VERSION; ?></div>
            </div>
            <div class="info-item">
                <div class="info-label">Server Time</div>
                <div class="info-value"><?php echo date('Y-m-d H:i:s'); ?></div>
            </div>
            <div class="info-item">
                <div class="info-label">Server OS</div>
                <div class="info-value"><?php echo PHP_OS; ?></div>
            </div>
            <div class="info-item">
                <div class="info-label">Memory Limit</div>
                <div class="info-value"><?php echo ini_get('memory_limit'); ?></div>
            </div>
        </div>

        <div class="info-card">
            <h3>📁 Directory Structure:</h3>
            <ul>
                <li><strong>/diat/</strong> - Main PHP application directory</li>
                <li><strong>index.php</strong> - Main entry point</li>
                <li><strong>config/</strong> - Configuration files (to be created)</li>
                <li><strong>includes/</strong> - Reusable PHP components (to be created)</li>
            </ul>
        </div>

        <div class="info-card">
            <h3>🛠️ Quick Start Commands:</h3>
            <ul>
                <li><code>cd diat</code> - Navigate to PHP directory</li>
                <li><code>php -S 0.0.0.0:8080</code> - Start PHP development server</li>
                <li><code>composer init</code> - Initialize Composer (if needed)</li>
            </ul>
        </div>
    </div>
</body>
</html>