# ===========================================
# Script de Teste Automatizado - UAIFOOD API
# ===========================================

$baseUrl = "http://localhost:3000"
$adminEmail = "admin@uaifood.com"
$adminPassword = "Admin@123"
$clientEmail = "maria@example.com"
$clientPassword = "Maria@123"
$ownerEmail = "dono.pizzaria@example.com"
$ownerPassword = "Pizza@123"

$results = @()
$totalTests = 0
$passedTests = 0
$failedTests = 0

function Write-TestHeader {
    param([string]$title)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Write-TestResult {
    param(
        [string]$testName,
        [bool]$passed,
        [string]$details = ""
    )
    
    $script:totalTests++
    
    if ($passed) {
        Write-Host "[✓] $testName" -ForegroundColor Green
        $script:passedTests++
        $script:results += @{ Test = $testName; Status = "PASS"; Details = $details }
    } else {
        Write-Host "[✗] $testName" -ForegroundColor Red
        if ($details) {
            Write-Host "    Erro: $details" -ForegroundColor Yellow
        }
        $script:failedTests++
        $script:results += @{ Test = $testName; Status = "FAIL"; Details = $details }
    }
}

function Invoke-ApiTest {
    param(
        [string]$method,
        [string]$endpoint,
        [string]$token = "",
        [object]$body = $null
    )
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($token) {
            $headers["Authorization"] = "Bearer $token"
        }
        
        $params = @{
            Uri = "$baseUrl$endpoint"
            Method = $method
            Headers = $headers
            ErrorAction = "Stop"
        }
        
        if ($body) {
            $params["Body"] = ($body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        return @{ Success = $true; Data = $response; StatusCode = 200 }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMessage = $_.Exception.Message
        
        try {
            $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
            $errorMessage = $errorResponse.message -join ", "
        } catch {}
        
        return @{ Success = $false; Error = $errorMessage; StatusCode = $statusCode }
    }
}

# ===========================================
# FASE 1: AUTENTICAÇÃO
# ===========================================
Write-TestHeader "FASE 1: AUTENTICAÇÃO"

# Teste 1.1: Registro de novo cliente
$newClient = @{
    name = "Teste Cliente"
    email = "teste@cliente.com"
    password = "Teste@123"
    phone = "31999999999"
}

$response = Invoke-ApiTest -method POST -endpoint "/auth/register" -body $newClient
Write-TestResult -testName "Registro de novo CLIENT" -passed $response.Success -details $response.Error

# Teste 1.2: Login ADMIN
$loginAdmin = @{
    email = $adminEmail
    password = $adminPassword
}

$response = Invoke-ApiTest -method POST -endpoint "/auth/login" -body $loginAdmin
if ($response.Success) {
    $adminToken = $response.Data.data.access_token
    Write-TestResult -testName "Login ADMIN" -passed $true
} else {
    Write-TestResult -testName "Login ADMIN" -passed $false -details $response.Error
    exit
}

# Teste 1.3: Login CLIENT
$loginClient = @{
    email = $clientEmail
    password = $clientPassword
}

$response = Invoke-ApiTest -method POST -endpoint "/auth/login" -body $loginClient
if ($response.Success) {
    $clientToken = $response.Data.data.access_token
    Write-TestResult -testName "Login CLIENT" -passed $true
} else {
    Write-TestResult -testName "Login CLIENT" -passed $false -details $response.Error
}

# Teste 1.4: Login OWNER
$loginOwner = @{
    email = $ownerEmail
    password = $ownerPassword
}

$response = Invoke-ApiTest -method POST -endpoint "/auth/login" -body $loginOwner
if ($response.Success) {
    $ownerToken = $response.Data.data.access_token
    Write-TestResult -testName "Login RESTAURANT_OWNER" -passed $true
} else {
    Write-TestResult -testName "Login RESTAURANT_OWNER" -passed $false -details $response.Error
}

# ===========================================
# FASE 2: USUÁRIOS
# ===========================================
Write-TestHeader "FASE 2: USUÁRIOS"

# Teste 2.1: Obter perfil (CLIENT)
$response = Invoke-ApiTest -method GET -endpoint "/users/me" -token $clientToken
Write-TestResult -testName "GET /users/me (CLIENT)" -passed $response.Success -details $response.Error

# Teste 2.2: Listar usuários (ADMIN)
$response = Invoke-ApiTest -method GET -endpoint "/users" -token $adminToken
Write-TestResult -testName "GET /users (ADMIN)" -passed $response.Success -details $response.Error

# Teste 2.3: CLIENT tenta listar usuários (deve falhar)
$response = Invoke-ApiTest -method GET -endpoint "/users" -token $clientToken
Write-TestResult -testName "GET /users (CLIENT - deve dar 403)" -passed ($response.StatusCode -eq 403) -details "Autorização corretamente bloqueada"

# ===========================================
# FASE 3: RESTAURANTES
# ===========================================
Write-TestHeader "FASE 3: RESTAURANTES"

# Teste 3.1: Listar restaurantes (público)
$response = Invoke-ApiTest -method GET -endpoint "/restaurants"
if ($response.Success) {
    $restaurantId = $response.Data.data[0].id
    Write-TestResult -testName "GET /restaurants (público)" -passed $true
} else {
    Write-TestResult -testName "GET /restaurants (público)" -passed $false -details $response.Error
}

# Teste 3.2: Obter detalhes do restaurante
$response = Invoke-ApiTest -method GET -endpoint "/restaurants/$restaurantId"
Write-TestResult -testName "GET /restaurants/:id" -passed $response.Success -details $response.Error

# Teste 3.3: Criar restaurante (ADMIN)
$newRestaurant = @{
    name = "Restaurante Teste"
    description = "Descrição teste"
    address = "Rua Teste, 123"
    phone = "31999999999"
    openingHours = @{
        seg = "11:00-22:00"
        ter = "11:00-22:00"
    }
    category = "Brasileira"
    deliveryFee = 5.0
    deliveryTime = "30-40 min"
    minimumOrder = 20.0
}

$response = Invoke-ApiTest -method POST -endpoint "/restaurants" -token $adminToken -body $newRestaurant
if ($response.Success) {
    $newRestaurantId = $response.Data.data.id
    Write-TestResult -testName "POST /restaurants (ADMIN)" -passed $true
} else {
    Write-TestResult -testName "POST /restaurants (ADMIN)" -passed $false -details $response.Error
}

# Teste 3.4: CLIENT tenta criar restaurante (deve falhar)
$response = Invoke-ApiTest -method POST -endpoint "/restaurants" -token $clientToken -body $newRestaurant
Write-TestResult -testName "POST /restaurants (CLIENT - deve dar 403)" -passed ($response.StatusCode -eq 403) -details "Autorização corretamente bloqueada"

# Teste 3.5: Atualizar restaurante (ADMIN)
if ($newRestaurantId) {
    $updateData = @{
        name = "Restaurante Atualizado"
        rating = 4.5
    }
    
    $response = Invoke-ApiTest -method PATCH -endpoint "/restaurants/$newRestaurantId" -token $adminToken -body $updateData
    Write-TestResult -testName "PATCH /restaurants/:id (ADMIN)" -passed $response.Success -details $response.Error
}

# ===========================================
# FASE 4: PRODUTOS
# ===========================================
Write-TestHeader "FASE 4: PRODUTOS"

# Teste 4.1: Listar produtos do restaurante (público)
$response = Invoke-ApiTest -method GET -endpoint "/products?restaurantId=$restaurantId"
if ($response.Success -and $response.Data.data.Length -gt 0) {
    $productId = $response.Data.data[0].id
    Write-TestResult -testName "GET /products?restaurantId (público)" -passed $true
} else {
    Write-TestResult -testName "GET /products?restaurantId (público)" -passed $false -details $response.Error
}

# Teste 4.2: Obter detalhes do produto
if ($productId) {
    $response = Invoke-ApiTest -method GET -endpoint "/products/$productId"
    Write-TestResult -testName "GET /products/:id" -passed $response.Success -details $response.Error
}

# Teste 4.3: Criar produto (ADMIN)
if ($newRestaurantId) {
    $newProduct = @{
        name = "Produto Teste"
        description = "Descrição do produto"
        price = 25.50
        category = "Teste"
        restaurantId = $newRestaurantId
        preparationTime = 20
        available = $true
    }
    
    $response = Invoke-ApiTest -method POST -endpoint "/products" -token $adminToken -body $newProduct
    if ($response.Success) {
        $newProductId = $response.Data.data.id
        Write-TestResult -testName "POST /products (ADMIN)" -passed $true
    } else {
        Write-TestResult -testName "POST /products (ADMIN)" -passed $false -details $response.Error
    }
}

# Teste 4.4: CLIENT tenta criar produto (deve falhar)
if ($newRestaurantId) {
    $response = Invoke-ApiTest -method POST -endpoint "/products" -token $clientToken -body $newProduct
    Write-TestResult -testName "POST /products (CLIENT - deve dar 403)" -passed ($response.StatusCode -eq 403) -details "Autorização corretamente bloqueada"
}

# Teste 4.5: Atualizar produto (OWNER)
if ($newProductId) {
    $updateProduct = @{
        name = "Produto Atualizado"
        price = 30.00
    }
    
    $response = Invoke-ApiTest -method PATCH -endpoint "/products/$newProductId" -token $ownerToken -body $updateProduct
    Write-TestResult -testName "PATCH /products/:id (OWNER)" -passed $response.Success -details $response.Error
}

# ===========================================
# FASE 5: VALIDAÇÃO DE RESPOSTA
# ===========================================
Write-TestHeader "FASE 5: ESTRUTURA DE RESPOSTA"

# Teste 5.1: Validar estrutura de sucesso
$response = Invoke-ApiTest -method GET -endpoint "/restaurants"
$hasSuccess = $response.Data.PSObject.Properties.Name -contains "success"
$hasData = $response.Data.PSObject.Properties.Name -contains "data"
$hasTimestamp = $response.Data.PSObject.Properties.Name -contains "timestamp"

Write-TestResult -testName "Resposta contém 'success'" -passed $hasSuccess
Write-TestResult -testName "Resposta contém 'data'" -passed $hasData
Write-TestResult -testName "Resposta contém 'timestamp'" -passed $hasTimestamp

# ===========================================
# RELATÓRIO FINAL
# ===========================================
Write-Host "`n" -NoNewline
Write-TestHeader "RELATÓRIO FINAL"

Write-Host "`nTotal de testes: $totalTests" -ForegroundColor White
Write-Host "Aprovados: $passedTests" -ForegroundColor Green
Write-Host "Falharam: $failedTests" -ForegroundColor Red

$successRate = [math]::Round(($passedTests / $totalTests) * 100, 2)
Write-Host "`nTaxa de sucesso: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } else { "Yellow" })

# Tabela de resultados
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DETALHAMENTO DOS TESTES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

foreach ($result in $results) {
    $status = if ($result.Status -eq "PASS") { "[✓]" } else { "[✗]" }
    $color = if ($result.Status -eq "PASS") { "Green" } else { "Red" }
    
    Write-Host "$status $($result.Test)" -ForegroundColor $color
    if ($result.Details -and $result.Status -eq "FAIL") {
        Write-Host "    → $($result.Details)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Testes concluídos!`n" -ForegroundColor Green
