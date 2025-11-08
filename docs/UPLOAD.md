# Sistema de Upload de Imagens 📷

## Configuração

O sistema de upload foi implementado usando **Multer** com as seguintes características:

### Validações

- **Tipos permitidos**: JPEG, JPG, PNG, GIF, WEBP
- **Tamanho máximo**: 5 MB por arquivo
- **Armazenamento**: Pasta `/uploads` no servidor
- **Nomenclatura**: `{fieldname}-{timestamp}-{random}.{ext}`

### Endpoints Disponíveis

#### 1. Upload de Imagem do Restaurante

```http
POST /api/restaurants/:id/image
Authorization: Bearer {token}
Content-Type: multipart/form-data
Role: ADMIN ou RESTAURANT_OWNER

Body (form-data):
- image: [arquivo de imagem]
```

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "data": {
    "message": "Imagem do restaurante atualizada com sucesso",
    "restaurant": {
      "id": "uuid",
      "name": "Nome do Restaurante",
      "image": "/uploads/image-1234567890-987654321.jpg",
      "updatedAt": "2025-11-08T13:00:00.000Z"
    }
  },
  "timestamp": "2025-11-08T13:00:00.000Z"
}
```

#### 2. Upload de Imagem do Produto

```http
POST /api/products/:id/image
Authorization: Bearer {token}
Content-Type: multipart/form-data
Role: ADMIN ou RESTAURANT_OWNER

Body (form-data):
- image: [arquivo de imagem]
```

**Resposta de sucesso (200):**
```json
{
  "success": true,
  "data": {
    "message": "Imagem do produto atualizada com sucesso",
    "product": {
      "id": "uuid",
      "name": "Nome do Produto",
      "image": "/uploads/image-1234567890-987654321.jpg",
      "updatedAt": "2025-11-08T13:00:00.000Z"
    }
  },
  "timestamp": "2025-11-08T13:00:00.000Z"
}
```

### Erros Possíveis

**400 Bad Request** - Nenhum arquivo enviado:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Nenhum arquivo foi enviado",
  "error": "Bad Request",
  "timestamp": "2025-11-08T13:00:00.000Z",
  "path": "/api/restaurants/uuid/image"
}
```

**400 Bad Request** - Formato inválido:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Formato de arquivo inválido. Permitidos: JPEG, JPG, PNG, GIF, WEBP",
  "error": "Bad Request",
  "timestamp": "2025-11-08T13:00:00.000Z",
  "path": "/api/restaurants/uuid/image"
}
```

**413 Payload Too Large** - Arquivo muito grande:
```json
{
  "success": false,
  "statusCode": 413,
  "message": "File too large",
  "error": "Payload Too Large",
  "timestamp": "2025-11-08T13:00:00.000Z",
  "path": "/api/restaurants/uuid/image"
}
```

**404 Not Found** - Recurso não encontrado:
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Restaurante não encontrado",
  "error": "Not Found",
  "timestamp": "2025-11-08T13:00:00.000Z",
  "path": "/api/restaurants/uuid/image"
}
```

## Testando via Swagger

1. Acesse: http://localhost:3000/api/docs
2. Faça login e copie o token JWT
3. Clique em **Authorize** e cole o token
4. Navegue até o endpoint de upload desejado
5. Clique em **Try it out**
6. Selecione um arquivo de imagem
7. Execute a requisição

## Testando via cURL

```bash
# Upload de imagem do restaurante
curl -X POST http://localhost:3000/api/restaurants/{id}/image \
  -H "Authorization: Bearer {seu_token}" \
  -F "image=@caminho/para/imagem.jpg"

# Upload de imagem do produto
curl -X POST http://localhost:3000/api/products/{id}/image \
  -H "Authorization: Bearer {seu_token}" \
  -F "image=@caminho/para/imagem.jpg"
```

## Testando via Postman

1. Método: **POST**
2. URL: `http://localhost:3000/api/restaurants/{id}/image`
3. Headers:
   - Authorization: `Bearer {seu_token}`
4. Body:
   - Selecione **form-data**
   - Key: `image` (tipo: File)
   - Value: Selecione o arquivo

## Acessando Imagens

As imagens carregadas ficam disponíveis em:

```
http://localhost:3000/uploads/{filename}
```

Exemplo:
```
http://localhost:3000/uploads/image-1699450000000-123456789.jpg
```

## Estrutura de Arquivos

```
backend/
├── uploads/                    # Pasta de armazenamento
│   ├── .gitkeep               # Mantém pasta no git
│   └── image-*.jpg            # Imagens enviadas
├── src/
│   ├── common/
│   │   └── config/
│   │       └── multer.config.ts   # Configuração do Multer
│   ├── restaurants/
│   │   ├── restaurants.controller.ts  # Endpoint de upload
│   │   └── restaurants.service.ts     # Método updateImage
│   └── products/
│       ├── products.controller.ts     # Endpoint de upload
│       └── products.service.ts        # Método updateImage
└── UPLOAD.md                  # Esta documentação
```

## Segurança

- ✅ Validação de tipo de arquivo (mimetype + extensão)
- ✅ Limite de tamanho (5 MB)
- ✅ Nome único gerado automaticamente
- ✅ Autenticação JWT obrigatória
- ✅ Autorização por roles (ADMIN/OWNER)
- ✅ Validação de existência do recurso

## Melhorias Futuras

- [ ] Compressão automática de imagens
- [ ] Redimensionamento para thumbnails
- [ ] Upload para cloud storage (AWS S3, Cloudinary)
- [ ] Remoção de imagens antigas ao atualizar
- [ ] Suporte a múltiplas imagens por produto
- [ ] Validação de dimensões mínimas/máximas
