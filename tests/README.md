# Testes Exploratórios com Selenium

Este diretório contém testes exploratórios automatizados usando Selenium WebDriver para o Comandax.

## Estrutura do Projeto

```
tests/
├── exploratory/
│   ├── pages/
│   │   ├── base_page.py
│   │   └── products_page.py
│   ├── utils/
│   │   └── driver_factory.py
│   ├── conftest.py
│   └── test_products.py
├── requirements.txt
├── pytest.ini
└── .gitignore
```

## Pré-requisitos

- Python 3.8 ou superior
- Google Chrome instalado
- Node.js e npm (para executar a aplicação)

## Instalação

1. Crie um ambiente virtual Python:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate  # Windows
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Crie um arquivo `.env` na pasta `tests/` com as seguintes variáveis:
```
BASE_URL=http://localhost:5173
```

## Executando os Testes

1. Certifique-se de que a aplicação está rodando:
```bash
npm run dev
```

2. Execute os testes:
```bash
# Execute todos os testes
pytest

# Execute testes específicos
pytest test_products.py

# Execute testes com marcadores específicos
pytest -m exploratory

# Execute testes em paralelo
pytest -n auto

# Gere relatório HTML
pytest --html=reports/report.html
```

## Relatórios e Screenshots

- Os relatórios HTML são gerados na pasta `reports/`
- As screenshots são salvas na pasta `screenshots/`

## Notas

- Os testes são executados em modo não-headless por padrão. Para executar em modo headless, modifique o `driver_factory.py`
- Os testes incluem delays artificiais (time.sleep) para demonstração. Em um ambiente de produção, use esperas explícitas
- Os testes são exploratórios e podem precisar de ajustes baseados nas mudanças da interface
