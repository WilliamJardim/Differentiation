/**
* WilliamJardim/Differentiation © 2024 by William Alves Jardim is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International. 
* To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/
*/

var tabela_derivadas = {
    'sen(<alguma_coisa>)' : 'cos(<alguma_coisa>)',
    'cos(<alguma_coisa>)' : '-sen(<alguma_coisa>)',
    'ln(<alguma_coisa>)'  : '1/(<alguma_coisa>)',
    '<alguma_coisa>^<outra_coisa>' : '<outra_coisa> * <alguma_coisa> ^ <outra_coisa>-1',
    'e^<alguma_coisa>' : 'e^<alguma_coisa>',
    '<alguma_coisa>': '1'
}

let exemplo = 'sen( x^2 + cos(x * y) )';
//Esperado
//cos( x^2 + cos(x * y) ) * 2x^1 + -sen(x * y) * 1 * y)
var last_deriv_id = 0;
var utils = {
    contarCaracter: function(texto, carater){
        return String(texto).split(carater).length-1
    },

    compareIgnoringSpaces: function(str1, str2) {
        // Remove todos os espaços das strings
        const cleanStr1 = str1.replace(/\s+/g, '');
        const cleanStr2 = str2.replace(/\s+/g, '');
        
        // Compara as strings limpas
        return cleanStr1 === cleanStr2;
    },

    nextId: function(prefix){
        last_deriv_id++;
        return String(prefix) + String(last_deriv_id);
    },

    isInteiramenteDentroDeUmaFuncao_E_UmaPotencia: function(expression){
        //TODO 

        //caminhos
        // (1) - identificar quando tem (expressao)^potencia E ADICIONALMENTE SE TEM pelo menos alguma letra antes da abertura do paranteses mais externo
        // (2) - identificar se tudo está evolvido em uma função como sen(expressao) e ADICIONALMENTE SE ISSO TUDO JÀ È SEGUIDO DE UMA FUNÇÂO

        //vou escolher o 1 caminho que parece mais seguro

        let niveisOmitidos = validacoes.omitirNiveisAbaixoNivelAtual(expression);
        
        //Apenas o que vem ANTES da primeira potencia da expressao atual
        let apenasOQueVemAntesDaPrimeiraPotencia = utils.splitOne( validacoes.omitirNiveisAbaixoNivelAtual(expression), '^' )[0];
        let nomeFuncaoEnvolvendo = utils.splitOne(apenasOQueVemAntesDaPrimeiraPotencia, '(' )[0];

        //cortar o nome da função
        let expressaoInicioCortado;
        if( nomeFuncaoEnvolvendo.trim() != '' ){
            expressaoInicioCortado = expression.slice( nomeFuncaoEnvolvendo.length, expression.length );
        }else{
            expressaoInicioCortado = expression;
        }

        //Analisar se tem (expressao)^potencia
        let isEntreParentesesComPotencia = utils.isEnvolvidaEmParentesesEUmaPotencia(expressaoInicioCortado);

        if( isEntreParentesesComPotencia == true &&
            nomeFuncaoEnvolvendo.trim() != ''
        ){
            return true;
        }

        return false;

        //retulizar o código de utils.isEnvolvidaEmParentesesEUmaPotencia e utils.isInteiramenteDentroDeUmaFuncao e outras
        /**
         * uma função javascript, que analise uma função matemática em string, retornando true caso toda a expressão da função esteja embalada dentro de uma função pai, E TAMBÈM, TUDO ISSO SEJA SEGUIDO DE UMA POTENCIA, como nos exemplos abaixo:

            Input: cos(x+5)^n
            Output: true

            Input: cos(x+5)
            Output: false

            Input: cos(x)^5
            Output: true

            Input: cos(x)^5
            Output: false

            Input: cos(x) + sen(y)^5
            Output: false

            Input: ln(cos(x) + sen(y))^5
            Output: true

            Input: ln(x + y)^5
            Output: true

            Input: ln(x^2 + y^4)^5
            Output: true

            Input: (x^2 + y^4)^5
            Output: false

            Input: (x + y)^5
            Output: false

            Input: cos(x + y)^5
            Output: true

            Input: ln(cos(x) + sen(y))^5
            Output: true

            Input: ln(cos(x) + sen(y))^n
            Output: true

            Input: ln(cos(x) + sen(y))^(2y+8)
            Output: true

            Input: ln(cos(x) + sen(y))^(2y+8)
            Output: true

            Input: ln(cos(x) + sen(y))^2y
            Output: true

            Input: ln(cos(x*8) + sen(y*2))^n
            Output: true

            Input: ln(cos(x*8) + sen(y*2))^2
            Output: true

            Input: ln(cos(x*8) + sen(y*2))
            Output: false

            Input: cos(x*8) + sen(y*2)^(2y+8)
            Output: false

            Input: cos(x + z) + sen(y + 2)^(2y+8)
            Output: false

            Input: sen(cos(x + z) + sen(y + 2))^(2y+8)
            Output: true

            Input: cos(cos(x + z) + sen(y + 2))^(2y+8)
            Output: true

            Input: sen(cos(x + z) + sen(y + 2))^n
            Output: true

            Input: cos(cos(x + z) + sen(y + 2))^x
            Output: true

            Input: cos(cos(x + z) + sen(y + 2))^10
            Output: true

            Input: cos(cos(x + z) + sen(y + 2))^100
            Output: true

            Input: cos(cos(x + z) + sen(y + 2))^cos(y * sen(z))
            Output: true

            Input: cos(x + z) + sen(y + 2)^cos(y * sen(z))
            Output: false

            Input: ((x + z) + sen(y + 2))^cos(y * sen(z))
            Output: false


         */
    },

    //Verifica se uma função está entre parenteses com uma potencia, ex: (..expressa...)^potencia
    isEnvolvidaEmParentesesEUmaPotencia: function(expression) {
        // Remove espaços extras
        const trimmedExpression = expression.trim();
    
        // Regex para identificar se a expressão está entre parênteses e é seguida por uma potência
        const regex = /^\((.*)\)\s*\^\s*.*$/;
    
        // Testa se a expressão corresponde ao padrão
        const match = regex.exec(trimmedExpression);
    
        // Verifica se a expressão está corretamente entre parênteses e tem uma potência
        return !!match;
    },

    // uma função javascript que identifique se uma função matemática é um "e" elevado a alguma coisa, e que não seja apenas e^x da tabela de derivadas
    isExponentiationOfE: function(funcStr){
        // Remover espaços em branco para simplificar a análise
        const cleanedStr = String(funcStr).replace(/\s+/g, '');
        
        // Verificar se a função começa com "e^"
        if (cleanedStr.startsWith('e^')) {
            // Obter a expressão após "e^"
            const exponent = cleanedStr.slice(2);

            // Verificar se o expoente não é simplesmente "x" ou vazio
            if (exponent && exponent !== 'x') {
                return true;  // É uma exponenciação de e com algo diferente de 'x'
            }
        }

        return false;  // Não é da forma "e^f(x)"
    },

    // uma função javascript que identifique se uma função matemática é um uma constante(que pode ser uma função toda constante) elevado a outra coisa
    isExponentiation: function(funcStr){
        // Remover espaços em branco para simplificar a análise
        const cleanedStr = String(funcStr).replace(/\s+/g, '');
        
        // Verificar se a função começa com "^"
        if (cleanedStr.startsWith('^')) {
            return true;
        }

        return false;  // Não é da forma "e^f(x)"
    },

    // uma função javascript que identifique se uma função matemática é um uma constante(que pode ser uma função toda constante) elevado a outra coisa, e que não seja apenas e^x da tabela de derivadas
    isExponentiationDifferentOfTable: function(funcStr){
        // Remover espaços em branco para simplificar a análise
        const cleanedStr = String(funcStr).replace(/\s+/g, '');
        
        // Verificar se a função começa com "^"
        if (cleanedStr.startsWith('^')) {
            // Obter a expressão após "^"
            const exponent = cleanedStr.slice(1);

            // Verificar se o expoente não é simplesmente "x" ou vazio
            if (exponent && exponent !== 'x') {
                return true;  // É uma exponenciação de e com algo diferente de 'x'
            }
        }

        return false;  // Não é da forma "e^f(x)"
    },
    
    /**
     * uma função javascript que identifique se uma função matemática está inteira envolvida entre umas chaves de uma função externa, como nos exemplos abaixo:

        Input: "cos(sen(j+h * x) + sen(y * h) + cos(45) * z)"
        Output: true

        ---------------------------------------------------

        Input: "sen(j+h * x) + sen(y * h) + cos(45) * z"
        Output: false

        ----------------------------------------------------

        Input: "cos(jk4+8 * cos(e^(56 * x+cos(45j * x)+cos(45yu))))"
        Output: true

        ----------------------------------------------------

        Input: "2*x + 5*y - 2"
        Output: false

        ----------------------------------------------------

        Input: "arcsen(2*x + 5*y - 2)"
        Output: true


        ----------------------------------------------------

        Input: "tan(2*x) + tan(5*y) - tan(2)"
        Output: false

        ----------------------------------------------------

        Input: "tan(2*x + 5*y - 2)"
        Output: true

        ----------------------------------------------------

        Input: "tan(2*x + 5*y - 2) + sen(y+u)"
        Output: false

        ----------------------------------------------------

        Input: "ln( tan(2*x + 5*y - 2) + sen(y+u) )"
        Output: true

        ----------------------------------------------------

        Input: "ln( tan(2*x + 5*y - 2) + sen(y+u) + tan(t*x + 5*x - 2*y) )"
        Output: true
    * @param {*} expression 
    * @returns 
    */
    isInteiramenteDentroDeUmaFuncao: function(expression) {
        const functionRegex = /^[a-zA-Z]+\(.*\)$/; // Regex para capturar funções matemáticas como "cos", "sen", etc.
    
        // Se a expressão inteira começa com uma função seguida por parênteses
        if (!functionRegex.test(expression.trim())) {
            return false;
        }
    
        let balance = 0;
        let firstParenthesis = false;
    
        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            
            if (char === '(') {
                balance++;
                firstParenthesis = true;
            } else if (char === ')') {
                balance--;
            }
    
            // Verifica se saiu do nível mais alto de parênteses da função externa
            if (firstParenthesis && balance === 0 && i !== expression.length - 1) {
                return false; // Há algo após o fechamento do primeiro parêntese
            }
        }
    
        // Se o balanceamento dos parênteses está correto e tudo foi envolvido por eles
        return balance === 0;
    },

    /**
    * Crie uma função javascript que identifique se uma função matemática está inteira envolvida entre umas chaves de uma função externa, como nos exemplos abaixo:

        Input: "(sen(j+h * x) + sen(y * h) + cos(45) * z)"
        Output: true

        ---------------------------------------------------

        Input: "(j+h * x) + sen(y * h) + cos(45) * z"
        Output: false

        ----------------------------------------------------

        Input: "(jk4+8 * cos(e^(56 * x+cos(45j * x)+cos(45yu))))"
        Output: true

        ----------------------------------------------------

        Input: "2*x + 5*y - 2"
        Output: false

        ----------------------------------------------------

        Input: "(2*x + 5*y - 2)"
        Output: true


        ----------------------------------------------------

        Input: "tan(2*x) + tan(5*y) - tan(2)"
        Output: false

        ----------------------------------------------------

        Input: "(2*x + 5*y - 2)"
        Output: true

        ----------------------------------------------------

        Input: "tan(2*x + 5*y - 2) + sen(y+u)"
        Output: false

        ----------------------------------------------------

        Input: "( tan(2*x + 5*y - 2) + sen(y+u) )"
        Output: true

        ----------------------------------------------------

        Input: "( tan(2*x + 5*y - 2) + sen(y+u) + tan(t*x + 5*x - 2*y) )"
        Output: true


 
    * @param {*} expression 
    * @returns 
    */
    isInteramenteEnvolvidaEmParenteses: function(expression) {
        // Remover espaços em branco
        expression = expression.trim();
        
        // Verificar se a expressão começa com '(' e termina com ')'
        if (expression[0] === '(' && expression[expression.length - 1] === ')') {
            // Contador para checar se os parênteses estão balanceados
            let balance = 0;
            
            // Percorrer os caracteres internos (exceto o primeiro e o último)
            for (let i = 0; i < expression.length; i++) {
            if (expression[i] === '(') {
                balance++;
            } else if (expression[i] === ')') {
                balance--;
            }
        
            // Se em algum momento o balance ficar negativo, significa que houve fechamento prematuro
            if (balance < 0) {
                return false;
            }
        
            // Se chegamos ao final e o balance está em 0, significa que os parênteses estão balanceados
            // Se o último parêntese fecha a expressão completa, então estamos OK.
            if (i === expression.length - 1 && balance === 0) {
                return true;
            }
            }
        }
        
        // Se não começa com '(' ou não termina com ')', não está inteiramente envolvido
        return false;
    },   

    /**
    * uma função javascript que receba uma função matemática dentro de d{conteudo}, e retorne apenas o conteudo removendo a chave inicial '{' e final '}', como nos exemplos abaixo:

        Input: "d{cos(sen(j+h * x) + sen(y * h) + cos(45) * z)}"
        Output: "cos(sen(j+h * x) + sen(y * h) + cos(45) * z)"

        -------------------------

        Input: "d{sen(j+h * x) + sen(y * h) + cos(45) * z}"
        Output: "sen(j+h * x) + sen(y * h) + cos(45) * z"

        ------------------------

        Input: "d{cos(jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu))))}"
        Output: "cos(jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu))))"

        -------------------------

        Input: "d{jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu)))}"
        Output: "jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu)))"
    * @param {*} expression 
    * @returns 
    */
    extrairConteudoEntreChaves: function(expression) {
        // Verifica se a string começa com 'd{' e termina com '}'
        if (expression.startsWith("d{") && expression.endsWith("}")) {
            // Remove o 'd{' inicial e o '}' final, retornando o conteúdo interno
            return expression.slice(2, -1);
        }
        return expression;  // Caso a string não tenha o formato esperado, retorna a própria string
    },

    /*
    *uma função Javascript que consiga pegar uma string, e separar os termos d{expressao}, e ainda identificar quais são os simbolos matemáticos entre um termo e outro, 
    por exemplo:

        Input: "d{cos(sen(j+h * x) + sen(y * h) + cos(45) * z)} * d{sen(j+h * x) + sen(y * h) + cos(45) * z)}"
        Output: {
            identificacoes: ['d{cos(sen(j+h * x) + sen(y * h) + cos(45) * z)}', 'd{sen(j+h * x) + sen(y * h) + cos(45) * z)}'],
            sinais:         ['*', null]
        }

        ----------------
        Input: "d{cos(jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu))))} * d{jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu)))}"
        Output: {
            identificacoes: ['d{cos(jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu))))}', 'd{jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu)))}'],
            sinais: ['*', null]
        }

        ------------------
        Input: "d{cos(sen(j+h * x) + sen(y * h) + cos(45) * z)} + d{sen(j+h * x) + sen(y * h) + cos(45) * z)}"
        Output: {
            identificacoes: ['d{cos(sen(j+h * x) + sen(y * h) + cos(45) * z)}', 'd{sen(j+h * x) + sen(y * h) + cos(45) * z)}'],
            sinais:         ['+', null]
        }

        ----------------
        Input: "d{cos(jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu))))} + d{jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu)))}"
        Output: {
            identificacoes: ['d{cos(jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu))))}', 'd{jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu)))}'],
            sinais: ['+', null]
        }
    *
    *
    */
    identificar_termos_precisa_derivar: function(input){
        // Expressão regular para capturar os termos d{...}
        const regexIdentificacao = /d\{[^{}]*\}/g;

        // Expressão regular para capturar os operadores matemáticos entre os termos
        const regexOperadores = /[*+-/]/g;

        // Encontrando as identificações
        const identificacoes = input.match(regexIdentificacao);

        // Encontrando os sinais entre os termos
        const sinais = [];
        let lastIndex = 0;
        identificacoes.forEach((identificacao, index) => {
            // Encontrando a posição após o termo atual
            lastIndex = input.indexOf(identificacao, lastIndex) + identificacao.length;
            
            // Capturando o próximo sinal matemático após o termo
            const nextSignal = input.slice(lastIndex).match(regexOperadores);
            
            // Adicionando o sinal encontrado ou null se não houver sinal
            sinais.push(nextSignal ? nextSignal[0] : null);
        });

        return {
            identificacoes,
            sinais
        };
    },

    /**
    * uma função javascript que analise uma função matemática em string, identifique e remova parenteses sendo fechados QUE NÂO FORAM ABERTOS NA EXPRESSÂO, como nos exemplos abaixo:

        Input: "d{cos( sen(j+h * x) + sen(y * h) + cos(45) * z )} * d{sen(j+h * x) + sen(y * h) + cos(45) * z )}"
        Output: {
            foundeds: [{ char: ')', char_range: [103, 104] }],
            string_removida: "d{cos( sen(j+h * x) + sen(y * h) + cos(45) * z )} * d{sen(j+h * x) + sen(y * h) + cos(45) * z}"
        }

        ------------

        Input: "d{cos( sen(j+h * x) + sen(y * h) + cos(45) * z )} * d{sen(j+h * x) + sen(y * h) + cos(45) * z}"
        Output: {
            foundeds: [],
            string_removida: "d{cos( sen(j+h * x) + sen(y * h) + cos(45) * z )} * d{sen(j+h * x) + sen(y * h) + cos(45) * z}"
        }


        ------------

        Input: "d{cos(jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu))))} * d{jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu)))}"
        Output: {
            foundeds: [],
            string_removida: "d{cos(jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu))))} * d{jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu)))}"
        }

        ------------

        Input: "d{cos(jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu)))) )) } * d{jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu)))}"
        Output: {
            foundeds: [ { char: ')', char_range: [57, 58] }, { char: ')', char_range: [58, 59] } ],
            string_removida: "d{cos(jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu))))} * d{jk4+8 * cos(e^(56x+cos(45jx)+cos(45yu)))}"
        }
    * @param {String} mathExpression 
    * @returns {Object}
    */
    removeUnmatchedParentheses: function(mathExpression) {
        let openParenthesisCount = 0;
        let correctedExpression = '';
        let foundeds = [];
    
        // Itera sobre a string para identificar e remover parênteses fechados que não foram abertos
        for (let i = 0; i < mathExpression.length; i++) {
            const char = mathExpression[i];
    
            if (char === '(') {
                openParenthesisCount++;
                correctedExpression += char;
            } else if (char === ')') {
                if (openParenthesisCount > 0) {
                    openParenthesisCount--;
                    correctedExpression += char;
                } else {
                    foundeds.push({ char: ')', char_range: [i, i + 1] });
                }
            } else {
                correctedExpression += char;
            }
        }
    
        return {
            foundeds,
            string_removida: correctedExpression
        };
    },

    /*
    * Remove simbolos que estão isolados
    * uma função javascript que pegue uma função matematica em string, e remove simbolos de multiplicação ou divisão que estão sozinhos como nos exemplos abaixo:
    *
    * Exemplos:
        Input: ' * cos(sen(j.hx)...sen(y.h)...cos(..)...z...kj) * kon(x...y) * kos(.x....)'
        Output: [ { removed: ' * ', char_range:[0, 2]  } ]

        Input: 'cos(sen(j.hx)...sen(y.h)...cos(..)...z...kj) * kon(x...y) * kos(.x....)'
        Output: []

        Input: 'cos(sen(j.hx)...sen(y.h)...cos(..)...z...kj) * kon(x...y) * kos(.x....) * ' 
        Output: [ { removed: ' * ', char_range:[72, 74]  } ]

        Input: 'cos(sen(j.hx)...sen(y.h)...cos(..)...z...kj) *  * kon(x...y) * kos(.x....)'
        Output: [ { removed: ' * ', char_range:[53, 56]  } ]

        Input: 'cos(sen(j.hx)...sen(y.h)...cos(..)...z...kj) *  * kon(x...y) * kos(.x....)'
        Output: [ { removed: ' * ', char_range:[53, 56]  } ]
    */
    removerSimbolosMultiplicacaoDivisaoIsolados: function(mathExpression) {
        const result = [];
        const regex = /(\s*[*\/]\s*)/g;
        let match;
    
        while ((match = regex.exec(mathExpression)) !== null) {
            const symbol = match[0].trim();
            const startIndex = match.index;
            const endIndex = regex.lastIndex;
    
            // Verifica se o símbolo está sozinho ou duplicado e não faz parte de uma operação matemática válida
            if ((symbol === '*' || symbol === '/') && (startIndex === 0 || endIndex === mathExpression.length || mathExpression[endIndex] === '*' || mathExpression[endIndex - match[0].length - 1] === '*')) {
                result.push({
                    removed: match[0],
                    char_range: [startIndex, endIndex]
                });
            }
        }
    
        return result;
    },

    /**
    * Uma função javascript que remove as partes da string que estivem contidas no parametro outputDetails, como nos exemplos abaixo:

        Input1: ' * cos(sen(j*hx) * cos(sen(j*hx) * sen(y+h*j*k/5) / x * cos(x*y) * z * kj) * kon(x+y*x+y) * kon(x+y*x+y)'
        Input2(details): [ {removed: ' * ', char_range:[0,3] } ]
        Output: 'cos(sen(j*hx) * cos(sen(j*hx) * sen(y+h*j*k/5) / x * cos(x*y) * z * kj) * kon(x+y*x+y) * kon(x+y*x+y)'

        ------

        Input1: 'cos(sen(j*hx) * cos(sen(j*hx) * sen(y+h*j*k/5) / x * cos(x*y) * z * kj) * kon(x+y*x+y) * kon(x+y*x+y)'
        Input2(details): []
        Output: 'cos(sen(j*hx) * cos(sen(j*hx) * sen(y+h*j*k/5) / x * cos(x*y) * z * kj) * kon(x+y*x+y) * kon(x+y*x+y)'

        -----

        Input1: 'cos(sen(j*hx) * cos(sen(j*hx) * sen(y+h*j*k/5) / x * cos(x*y) * z * kj) *  * kon(x+y*x+y) * kon(x+y*x+y)'
        Input2(details): [ {removed: ' * ', char_range:[71, 74] } ]
        Output: 'cos(sen(j*hx) * cos(sen(j*hx) * sen(y+h*j*k/5) / x * cos(x*y) * z * kj) * kon(x+y*x+y) * kon(x+y*x+y)'

        A função só deve remover extritamente os caracteres do char_range, de forma segura, e sem erros

        cos(sen(j*hx) * cos(sen(j*hx) * sen(y+h*j*k/5) / x * cos(x*y) * z * kj) *  * kon(x+y*x+y) * kon(x+y*x+y)
    
    * @param {String} inputString 
    * @param {Object[]} outputDetails 
    * @returns 
    */
    removerPartesDeUmaString: function(inputString, outputDetails) {
        // Copia a string de entrada para que possamos modificá-la sem afetar o original
        let modifiedString = inputString;
    
        // Ordena os detalhes em ordem decrescente para evitar erros de índice ao modificar a string
        outputDetails.sort((a, b) => b.char_range[0] - a.char_range[0]);
    
        // Percorre cada detalhe de remoção
        outputDetails.forEach(detail => {
            const { char_range } = detail;
            const [start, end] = char_range;
    
            // Remove estritamente os caracteres no intervalo [start, end]
            modifiedString = modifiedString.slice(0, start) + modifiedString.slice(end);
        });
    
        return modifiedString;
    },

    /*
    * Compara duas strings e retorna quais caracteres estão faltando em uma delas
    * Exemplo:
    * 
    *   Input1: ' * cos(sen(j*hx) * cos(sen(j*hx) * sen(y+h*j*k/5) / x * cos(x*y) * z * kj) * kon(x+y*x+y) * kon(x+y*x+y)'
        Input2: 'cos(sen(j.hx)...cos(sen(j.hx)...sen(y.h.j.k..)...x...cos(x.y)...z...kj)...kon(x.y.x.y)...kon(x.y.x.y)'
        Output: [ { missing: ' * ', char_range: [0,3] } ]


    */
    findMissingCharacters: function(input1, input2) {
        const result = [];
        let i = 0, j = 0;
    
        while (i < input1.length && j < input2.length) {
            if (input1[i] === input2[j]) {
                i++;
                j++;
            } else {
                const start = i;
                while (i < input1.length && input1[i] !== input2[j]) {
                    i++;
                }
                const missingChars = input1.slice(start, i);
                result.push({
                    missing: missingChars,
                    char_range: [start, i]
                });
            }
        }
    
        // Adiciona qualquer coisa restante de input1 como caracteres faltantes
        if (i < input1.length) {
            result.push({
                missing: input1.slice(i),
                char_range: [i, input1.length]
            });
        }
    
        return result;
    },

    //Obtem um array contendo os indices das posições(que representa todo lugar que aparece o caracter)
    getIndexesOf: function(texto, caracter){
        let posicoes = [];
        let ultimoIndice = 0;

        for( let c = 0 ; c < texto.length ; c++ )
        {
            let caracter_texto = texto[c];
            if( caracter_texto == caracter ) 
            {
                ultimoIndice = c;
                posicoes.push(ultimoIndice);
            }
        }

        return posicoes;
    },

    substituirTudo: function(texto, busca, valorSubst){
        return String(texto).split(busca).join(valorSubst);
    },

    splitOne: function(expressaoAtual, oque){
        let divide = expressaoAtual.split(oque);
        let novo = [];
        novo[0] = divide[0];
        novo[1] = String(expressaoAtual).replace(novo[0]+'(', '');
        return novo;
    },

    /**
     * Retorna a quantidade de parenteses não fechados
     * se for zero, é por que abriu e fechou todos na expressão
     * se tiver 1, ou mais, é por que faltou fechar algum
     * @param {*} expressaoAtual 
     * @returns 
     */
    qtdeParentesesNaoFechados: function(expressaoAtual){
        let qtdeParentesesAbertos = 0;
        for( let i = 0 ; i < expressaoAtual.length ; i++ )
        {
            let caracter = expressaoAtual[i];

            //Identifica que abriu um parenteses
            if( caracter == '(' ){
                qtdeParentesesAbertos++;

            //Identifica que fechou um parenteses
            }else if( caracter == ')' && qtdeParentesesAbertos > 0 ){
                qtdeParentesesAbertos--;
            }

        }

        return qtdeParentesesAbertos;
    },

    //Quantidade de parenteses que foram abertos e fechados
    qtdeParentesesAbriuEFechou: function(expressaoAtual){
        let qtdeParentesesCompletos = 0;
        let parentesesEmAbertos = 0;

        for( let i = 0 ; i < expressaoAtual.length ; i++ )
        {
            let caracter = expressaoAtual[i];

            //Identifica que abriu um parenteses
            if( caracter == '(' ){
                parentesesEmAbertos++;

            //Identifica que fechou um parenteses
            }else if( caracter == ')' && parentesesEmAbertos > 0 ){
                parentesesEmAbertos--;

                //Toda vez que fecha ALGO QUE JA FOI ABERTO, ele entende que achou um completo QUE ABRIU E FECHOU
                qtdeParentesesCompletos++;
            }
        }

        return qtdeParentesesCompletos;
            
    },

    /**
     * Retorna a quantidade de parenteses fechados QUE NÂO FORAM ABERTOS
     * se for zero, é por que abriu e fechou todos na expressão
     * se tiver 1, ou mais, é por que EXISTEM PARANTESES FECHADOS QUE NÂO FORAM ABERTOS NA EXPRESSÂO
     * @param {*} expressaoAtual 
     * @returns 
     */
    qtdeParentesesFechadosNaoAbertos: function(expressaoAtual){
        let qtdeParentesesFechados = 0;
        for( let i = 0 ; i < expressaoAtual.length ; i++ )
        {
            let caracter = expressaoAtual[i];

            //Identifica que abriu um parenteses
            if( caracter == ')' ){
                qtdeParentesesFechados++;

            //Identifica que fechou um parenteses
            }else if( caracter == '(' && qtdeParentesesFechados > 1 ){
                qtdeParentesesFechados--;
            }

        }
    
        //ignora os que foram fechados
        return ( qtdeParentesesFechados - utils.qtdeParentesesAbriuEFechou(expressaoAtual) );
    },

    //Conta quantos caracteres existem na função ANTES DA PRIMEIRA ABERTURA DE PARENTESES
    quantidadeCaracteresAntesAberturaParanteses: function(expressaoAtual){
        let quantidade = 0;
        for( let i = 0 ; i < expressaoAtual.length ; i++ )
        {   
            let caracter = expressaoAtual[i];
            if( caracter == '(' )
            {
                break;
            }
            quantidade++;
        }

        return quantidade;
    }
}

var validacoes = {

    //Conslta a tabela de derivadas pra encontrar qual regra corresponde ao começo da expressão atual
    consultarTabela: function(expressaoAtual){
        let quantidadeCaracteresAntesAberturaParanteses = utils.quantidadeCaracteresAntesAberturaParanteses(expressaoAtual);
        let keysTabela = Object.keys(tabela_derivadas);
        let comecoExpressao = expressaoAtual.slice(0, quantidadeCaracteresAntesAberturaParanteses+1).trim()
        let regra = null;

        for( let i = 0 ; i < keysTabela.length ; i++ )
        {
            let casoTabela = keysTabela[i],
                regraCaso  = tabela_derivadas[casoTabela],
                casoTratado = casoTabela.replace('<alguma_coisa>', '')
                                        .replace('<outra_coisa>', '').trim().toLowerCase()
                                        .replace(')', '');

            if( casoTratado.indexOf(comecoExpressao) != -1 ||
                (casoTratado.indexOf('e^') != -1 && comecoExpressao.indexOf('e^') != -1)
            ){
                regra = {
                    key: casoTabela,
                    value: regraCaso
                };

                break;
            }
        }

        //Se ainda não conseguiu identificar a regra
        //Tenta uma ultima possibilidade
        if( 
            //Se nenhuma das regras de cima foram encontradas
            regra == null 
            //Se tiver potencia
            && comecoExpressao.indexOf('^') != -1
        ){
            let casoTabela = '<alguma_coisa>^<outra_coisa>',
                regraCaso  = tabela_derivadas[casoTabela];

            let casoTratado = String(String(regraCaso).replace('<alguma_coisa>', expressaoAtual.trim().split('^')[0].trim()))
            casoTratado = utils.substituirTudo(casoTratado, '<outra_coisa>', expressaoAtual.trim().split('^')[1].trim() )

            //Soma o <valor>-1 pra poder terminar essa parte
            let expoente = casoTratado.split(' ')
                                      .find((parte)=>{
                                          if( parte.indexOf('-1') != -1 ) 
                                             return parte;
                                      });

            let expoente_subtraido = expoente.split('-')
                                             .map(
                                                function(subparte){ 
                                                   return Number(subparte) 
                                                }
                                              );

            expoente_subtraido = (expoente_subtraido[0] - expoente_subtraido[1]);

            regra = {
                key: casoTabela,
                //retira o espaço entre a potencia(talves opcional mais pode ser importante para o software)
                value: String(casoTratado.replace(expoente, String(expoente_subtraido))).replace( ' ^ '+String(expoente_subtraido), '^'+String(expoente_subtraido) )
            };
        }

        return regra;
    },

    //Identifica se dentro da expressão atual existe uma função
    temFuncao: function(expressaoAtual){
        //Se abriu um parenteses novo, e o caracter que estiver atrás dele não for um espaço em branco é por que tem função
        return expressaoAtual.indexOf('(') != -1 && expressaoAtual[expressaoAtual.indexOf('(')-1] != '';
    },

    //Identifica se uma função matemática é simples ou composta
    isFuncaoComposta: function(expressaoAtual, emRelacao=false){
        let isComposta = false;

        if( validacoes.getNivelMaisExterno(expressaoAtual)['internal'] != '' ){
            isComposta = true;
        }

        let patternFuncaoComposta;

        //Se for levar em conta a variavel EM RELAÇÂO A FUNÇÂO
        if( emRelacao != false )
        {
            // Regex ajustado para detectar a variável em qualquer lado de uma operação dentro dos parênteses
            patternFuncaoComposta = new RegExp(`\\b\\w+\\(.*\\b${emRelacao}\\b.*[\\+\\-\\*\\/\\^].*\\)|\\b\\w+\\(.*[\\+\\-\\*\\/\\^].*\\b${emRelacao}\\b.*\\)`);
        
        //Caso nao leva em conta
        }else{
            // Regex para identificar qualquer operação matemática dentro da função, ignorando a variável
            patternFuncaoComposta = /\b\w+\(.*[+\-*/^].*\)/;
        }

        // Verifica se há uma função com uma operação envolvendo a variável
        if (patternFuncaoComposta.test(expressaoAtual)) {
            isComposta = true;
        } else {
            isComposta = false;
        }

        return isComposta;
    },

    /* Tenta identificar algumas regras de derivação */
    regras: {
        /**
        * Verifica se numa potencia(da expressão atual) existe a regra da cadeia
        * Semelhante a verificação validacoes.temRegraDaCadeia, porém esse é mais especifico para potencia
        * @returns {Boolean}
        */
        temRegraDaCadeiaNaPotencia: function(expressaoAtual, emRelacao='x'){
            let ondeTemAPotencia = expressaoAtual.indexOf('^');
            let alcance = 8;
            let strRegiao = expressaoAtual.slice( (ondeTemAPotencia-alcance) < 0 ? 0 : (ondeTemAPotencia-alcance), (ondeTemAPotencia+alcance) > expressaoAtual.length ? expressaoAtual.length : ondeTemAPotencia+alcance );
            
            //Extrai as partes ANTES e DEPOIS do simbolo de potencia
            let parteAntesPotencia = utils.splitOne( expressaoAtual, '^' )[0];
            let parteDepoisPotencia = utils.splitOne( expressaoAtual, '^' )[1];

            //BUG: POR CAUSA DO ^ NA VALIDACAO ABAIXO, ELE SE CONFUNDE E ACHA QUE UMA POTENCIA SIMPLES xomo X^2 precisa usar regra da cadeia
            //COLOCAR PRA ELE IDENTIFICAR QUANDO FOR SIMPLES 
            //EU RESOLVI ISSO USANDO O LAST INDEX OF

            //verifica se tem um parenteses de função antes da potencia
            let temParentesesAntesPotencia = false;
            let parteVerificouParentesesAntesPotencia = expressaoAtual.slice(0, ondeTemAPotencia);
            for( let i = ondeTemAPotencia ; i > 0 ; i-- )
            {
                if( expressaoAtual[i] == '(' ){
                    temParentesesAntesPotencia = true;
                    break;
                }
            }

            //Se isso retornar TRUE significa que vai ser necessário usar regra da cadeia para derivar essa potencia
            if( 
                temParentesesAntesPotencia == false &&
                validacoes.temFuncao(parteVerificouParentesesAntesPotencia) == false &&
                ondeTemAPotencia != -1 && (
                    parteAntesPotencia.indexOf('+') != -1 ||
                    parteAntesPotencia.indexOf('-') != -1 ||
                    parteAntesPotencia.indexOf('/') != -1 ||
                    (parteAntesPotencia.lastIndexOf('^') != -1 && parteAntesPotencia.lastIndexOf('^') != ondeTemAPotencia) ||
                    parteAntesPotencia.indexOf('*') != -1 ||
                    parteAntesPotencia.indexOf('(') != -1 ||
                    parteAntesPotencia.indexOf(')') != -1
                ) 
            ){
                return true;

            }else{
                return false
            }
        },

        /** 
        * Identifica se numa expressão existe a regra da cadeia
        * @returns {Boolean}
        */
        temRegraDaCadeia: function(expressaoAtual, emRelacao='x'){
            let nivelMaisInterno = validacoes.getNivelMaisExterno(expressaoAtual, emRelacao)['internal'];
        
            //TODO: Identificar sub-funções que tenham a variavel emRelacao(DEIXANDO DE SER CONSTANTE)
            if( validacoes.isFuncaoComposta(expressaoAtual, false) == true && 
                validacoes.extrairCorpoFuncaoNivelAtual(expressaoAtual, 'checkE_elevado', 'checkConstante_elevado').indexOf(emRelacao) != -1
            ){
                return true;
            }
        
            return false;
        },

        //Verifica se uma expressão atual tem regra do produto envolvida
        temRegraProduto: function(expressaoAtual, emRelacao='x'){
            let temMultiplicao = expressaoAtual.indexOf('*') != -1 ? true : false;

            //Recorta antes e depois da multipliação, pra identificar se existe a variavel em ambas as partes
            let parte1 = expressaoAtual.split('*')[0], 
                parte2 = expressaoAtual.split('*')[1];

            if( 
                temMultiplicao == true &&
                parte1.indexOf(emRelacao) != -1 &&
                parte2.indexOf(emRelacao) != -1
            ){
                return true;

            }else{
                return false;
            }
        },
        
        //Verifica se uma expressão atual tem regra do quociente envolvida
        temRegraQuociente: function(expressaoAtual, emRelacao='x'){
            let temDivisao = expressaoAtual.indexOf('/') != -1 ? true : false;

            //Recorta antes e depois da multipliação, pra identificar se existe a variavel em ambas as partes
            let parte1 = expressaoAtual.split('/')[0], 
                parte2 = expressaoAtual.split('/')[1];

            if( 
                temDivisao == true &&
                parte1.indexOf(emRelacao) != -1 &&
                parte2.indexOf(emRelacao) != -1
            ){
                return true;

            }else{
                return false;
            }
        }
    },

    /**
    * Apenas para fins de uso interno,
    * para permitir o algoritmo observar apenas o nivel atual
    * retorna uma string contendo a expressaoAtual porém, com # no lugar onde teria os subniveis
    * ex:
    *   validacoes.getNivelMaisExterno('(a+b+(sen(x)^45)) * (x+y+a)', 'x')
    *   
    * resultado:
    *   "(a+b+###########) * (x+y+a)"
    * 
    * ele ignora o nivel de parenteses mais interno, e mantém na string apenas o nivel mais externo, em consideração á expressão atual
    * 
    * @param {String} expressaoAtual 
    * @returns {String}
    */
    getNivelMaisExterno: function(expressaoAtual, emRelacao='x', buscas=['(', ')']){
        let contagemProfundidadeAberta = 0;
        let nivelMaisExterno = '';
        let nivelMaisInterno = '';
        let isIgnorandoCaracter = false;

        for( let i = 0 ; i < expressaoAtual.length ; i++ ){
            let caracter = expressaoAtual[i];

            if( caracter == buscas[0] ){
                if( contagemProfundidadeAberta > 0 )
                {
                    //A partir da segunda abertura de parenteses, considera que está enxergando o nivel interno
                    isIgnorandoCaracter = true;
                }

                contagemProfundidadeAberta++;

            }else if( caracter == buscas[1] && contagemProfundidadeAberta > 0 ){
                contagemProfundidadeAberta--;

                if( contagemProfundidadeAberta == 0 )
                {
                    //Quando o parenteses fechar, ele volta a incluir os caracteres, pois estão no mesmo nivel
                    isIgnorandoCaracter = false;
                }
            }

            //TODO: permitir que a variavel emRelacao possa ser uma string ao invez de um caracter
            if( isIgnorandoCaracter == true )
            {
                if( caracter != emRelacao ){
                    nivelMaisExterno += '#';
                    nivelMaisInterno += caracter;

                //Se for a variavel em relação, ele mantem só ela pra nao perder 
                }else{  
                    nivelMaisExterno += caracter;
                    nivelMaisInterno += caracter;
                }

            }else{
                nivelMaisExterno += caracter;
            }
        }

        return {
            external: nivelMaisExterno,
            internal: nivelMaisInterno,
            openCounts: contagemProfundidadeAberta
        };
    },

    //Extrai apenas TODO O CORPO DA FUNÇÂO dentro do nivel atual ex cos( 2x + 5 ) vai trazer só o 2x + 5
    extrairCorpoFuncaoNivelAtual: function(expressaoOriginal, isE_elevado=false, isConstante_elevado=false){
        if( isE_elevado == 'checkE_elevado' ){
            isE_elevado = String(expressaoOriginal).slice(0, 4).trim().indexOf('e^') != -1 ? true : false;
        }

        if( isConstante_elevado == 'checkConstante_elevado' ){
            isConstante_elevado = String(expressaoOriginal).slice(0, 4).trim().indexOf('^') != -1 ? true : false;
        }

        //Se não for e^(alguma_coisa) e nem constante^(alguma_coisa)
        if(isE_elevado == false && isConstante_elevado == false){
            let quantidadeCaracteresAntesAberturaParanteses = utils.quantidadeCaracteresAntesAberturaParanteses(expressaoOriginal);
            let recorado = expressaoOriginal.slice(quantidadeCaracteresAntesAberturaParanteses+1, expressaoOriginal.length)
            
            //Se o ultimo caracter for um ) externo, remove, QUERO APENAS O CORPO DA FUNÇÂO
            if( recorado[ recorado.length-1 ] == ')' ){
                recorado = recorado.slice(0, recorado.length-1);
            }
            
            return recorado;
        
        //especifico caso seja e^<alguma_coisa>
        }else{
            if( isE_elevado == true ){
                //corrige um problema de repetição do termo do e^
                if( expressaoOriginal.indexOf('e^e^') == -1 ){
                    //a derivada de e^<alguma_coisa> é o propio e^<alguma_coisa>
                    return String(expressaoOriginal).replace('e^e^', 'e^');

                }else{
                    //a derivada de e^<alguma_coisa> é o propio e^<alguma_coisa>
                    return expressaoOriginal;
                }

            //caso seja o outro caso: do constante^(alguma_coisa) que também é um caso de exponencial
            }else if( isE_elevado == false && isConstante_elevado == true ){
                //a derivada de constante^<alguma_coisa> é a propia constante^<alguma_coisa>
                return expressaoOriginal;

            }
            
        }
    },

    //Remove os caracteres omitidos, fazendo eles serem visiveis novamente
    resubstituirTermosNivelMaisExterno: function(expressaoOriginal, expressaoMascarada){
        let expressaoDesmascarada = '';
        for( let i = 0 ; i < expressaoMascarada.length ; i++ )
        {
            expressaoDesmascarada += expressaoOriginal[i];
        }

        return expressaoDesmascarada;
    },

    //Extrai os termos indentificados(PARA PODER DERIVAR UM POR UM DEPOIS)
    //ex validacoes.get_derivacoes_identificadas('d{ (a+b+sen(x)^45) } *  (x+y+a) + (a+b+sen(x)^45)  * d{ (x+y+a) }', 'x')
    //vai retornar ['d{(a+b+sen(x)^45)', 'd{(x+y+a)']
    get_derivacoes_identificadas: function(expressao, emRelacao='x'){
        let parcelas = [];
        let capturando = false;
        let expressaoAtual = expressao.trim();

        //trata
        expressaoAtual = expressaoAtual.split('d{').join('d{ ');
        expressaoAtual = expressaoAtual.split('}').join(' }');

        let dividePartes = expressaoAtual.trim().split(' ');
        let contruindo = '';

        for( let i = 0 ; i < dividePartes.length ; i++ )
        {
            let biPalavra = dividePartes[i];

            if( biPalavra == 'd{' ){
                capturando = true;
            }

            if( capturando == true && biPalavra.indexOf('}') != -1 ){
                capturando = false;
                parcelas.push(contruindo.trim().replace('}', '').replace('d{', ''));
                contruindo = '';
            }

            if(capturando == true){
                contruindo += biPalavra;
            }
        }

        return parcelas;
    },

    extrairNivelMaisExterno: function(expressaoAtual){
        let result = [];

        /**
        * Os sinais é assim: depois do termo regraTermos[i] vem o signals[i]. Se o signals[i] for null ou undefined, isso significa que não tem nenhum signal a ser usado
        */
        let signals = [];
        
        let currentExpr = '';
        let openBrackets = 0;
    
        for (let i = 0; i < expressaoAtual.length; i++) {
            let char = expressaoAtual[i];
    
            if (char === '(') {
                openBrackets++;
            } else if (char === ')') {
                openBrackets--;
            }
    
            // Separar apenas se não houver parênteses abertos, ou seja, no nível mais externo
            if ( (char === '+' || char === '-') && openBrackets === 0) {
                signals.push(char);
                result.push(currentExpr.trim());
                currentExpr = '';
            } else {
                currentExpr += char;
            }
        }
    
        // Adiciona a última parte da expressão que restou
        if (currentExpr.trim()) {
            result.push(currentExpr.trim());
        }
    
        return {
            terms: result,
            signals: signals
        };
    },

    //TODO: TESTAR MELHOR ISSO DA ULTIMA RESPOSTA CHAT GPT
    omitirNiveisAbaixoNivelAtual: function(input) {
        let result = '';
        let depth = 0; // Controle de nível
        let depthStack = []; // Pilha para rastrear o nível de profundidade de cada caractere
    
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
    
            // Verifica o início de um novo nível com '('
            if (char === '(') {
                depth++;
                result += char;
            }
            // Verifica o fim de um nível com ')'
            else if (char === ')') {
                result += char;
                depth--;
            }
            // Mantém os nomes de funções e variáveis intactos
            else if (/[a-zA-Z]/.test(char)) {
                result += char;
            }
            // Mantém os símbolos matemáticos no nível atual
            else if (/[+\-*/^]/.test(char) && depth === 0) {
                result += char;
            }
            // Se o caractere é uma variável e está dentro do nível atual, mantém
            else if (/[xyze]/.test(char)) {
                result += char;
            }
            // Substitui números ou qualquer outro caractere que não faça parte do nível atual por pontos
            else if (!isNaN(char) || /[^a-zA-Z]/.test(char)) {
                if (depth > 0) {
                    result += '.';
                } else {
                    result += char;
                }
            }
        }
    
        return result;
    },

    //Identifica qual a regra mais externa(do nivel atual)
    identificarRegraMaisExterna: function(expressaoAtual, emRelacao='x'){
        
        // let keysRegras = Object.keys( this.regras );
        let nivelMaisExternoAtual = this.extrairNivelMaisExterno(expressaoAtual);
        let somas_divididas       = nivelMaisExternoAtual['terms'];
        let sinais                = nivelMaisExternoAtual['signals'];

        //para cada termo
        let regraTermos = [];
        let concated = '';

        for( let s = 0 ; s < somas_divididas.length ; s++)
        {
            let termoAtual = somas_divididas[s];

            //Omite os termos de niveis internos ao nivel atual, para facilitar a identificação de regra do produto e regra do quociente
            let termoAtual_niveis_internos_omitidos = validacoes.omitirNiveisAbaixoNivelAtual(termoAtual);

            //identifica a regra para este termo
            if( validacoes.regras.temRegraProduto(termoAtual_niveis_internos_omitidos, emRelacao) == true ){
                regraTermos.push('regra_produto');

            }else if( validacoes.regras.temRegraQuociente(termoAtual_niveis_internos_omitidos, emRelacao) == true ){
                regraTermos.push('regra_quociente');

            }else{
                //Pode ser outros casos
                if( validacoes.regras.temRegraDaCadeia(termoAtual, emRelacao) == true ){
                    regraTermos.push('regra_cadeia');

                //Tentar outra forma de identificar regra da cadeia para CASO DE POTENCIA
                //E PARA CASO HAJA MAIS DO QUE X de outra forma como cos(2x) que é cos(2*x)
                }else{
                    regraTermos.push('tabela_ou_nada');
                }
            }
        }

        //opcional(iguala o tamanho do array sinais)
        if(sinais.length < regraTermos.length){
            sinais = sinais.concat(Array(Math.abs(sinais.length - regraTermos.length)).fill(null));
        }

        //Monta uma string das regras com os sinais(opcional)
        for( let i = 0 ; i < regraTermos.length ; i++ ){
            concated += `${regraTermos[i]}${sinais[i] != undefined ? (' ' + String(sinais[i]) + ' ') : ' '}`;
        }

        return {
            expressao      : expressaoAtual,
            emRelacao      : emRelacao,
            termos_usados  : somas_divididas,
            regras         : regraTermos,
            sinais         : sinais,
            concated       : concated
        };
    }

}

//quanto ja sabemos qual caso usar, PODEMOS DESTACAR ELE NA FUNÇÂO
var identificacoes = {
    //TODO incluir o emRelacao
    identificar_regra_cadeia: function(expressao, emRelacao='x')
    {
        let parte_fora = expressao.trim(); //a expressão completa
        let parte_dentro; //a expressão de dentro
        
        //Extrai a expressão de dentro completa
        let splitOne = utils.splitOne(expressao.trim(), '(');
        parte_dentro = splitOne[1].trim();
        
        let qtdeParentesesFechadosNaoAbertos = utils.qtdeParentesesFechadosNaoAbertos( parte_dentro );
        let temParentesesNaoAbertos = qtdeParentesesFechadosNaoAbertos > 0 ? true : false;

        //Se tiver 1 parenteses fechado não aberto, significa que a função de fora nao foi fechada, portanto, precisamos remover o fechamento
        //SE O FINAL FOR UM PARENTESES NAO ABERTO
        if( temParentesesNaoAbertos && 
            parte_dentro[ parte_dentro.length-1 ] == ')' 
        ){
            //VAI REMOVER UM
            parte_dentro = String( parte_dentro.slice(0, parte_dentro.length-1) ).trim();
        }

        //Se tiver uma função, ele vai recortar o ultimo pararentes, onde termina a parte de dentro
        //ex  //sen( cos(x+1) + cos(y) )
        //if( validacoes.temFuncao( parte_dentro ) == true )
        //{
        //    parte_dentro = String(parte_dentro.split(')')[0]).trim();
        //}

        let regraStr = `d{${parte_fora}} * d{${parte_dentro}}`;
        return regraStr;
    },

    //Usado para montar a estrutura da regra do produto(com os termos identificados)
    //OBS: a expressão precisa ser o nivel atual E PRECISA TER A REGRA DO PRODUTO
    identificar_regra_produto: function(expressao, expressao_omitida, emRelacao='x'){
        if( !validacoes.regras.temRegraProduto(expressao_omitida, emRelacao) ){
            throw 'Nao tem regra do produto na expressao';
        }

        //let nivelMaisExterno = validacoes.getNivelMaisExterno(expressao)['external'];

        //Pega onde que está a multiplicação mais externa
        let posicaoDaMultiplicacao = expressao_omitida.indexOf('*');

        //TODO: MOSTRAR NOVAMENTE OS CARACTERES OMITIDOS
        let parteAntesMultiplicacao_completa  = expressao.slice(0, posicaoDaMultiplicacao);
        let parteDepoisMultiplicacao_completa = expressao.slice(posicaoDaMultiplicacao+1, expressao.length);

        return `d{${parteAntesMultiplicacao_completa}} * ${parteDepoisMultiplicacao_completa} + ${parteAntesMultiplicacao_completa} * d{${parteDepoisMultiplicacao_completa}}`;
    },

    //Usado para montar a estrutura da regra do quociente(com os termos identificados)
    //OBS: a expressão precisa ser o nivel atual E PRECISA TER A REGRA DO QUOCIENTE
    identificar_regra_quociente: function(expressao, expressao_omitida, emRelacao='x'){
        if( !validacoes.regras.temRegraQuociente(expressao_omitida, emRelacao) ){
            throw 'Nao tem regra do quociente na expressao';
        }

        //Pega onde que está a divisao mais externa
        let posicaoDaDivisao = expressao_omitida.indexOf('/');

        //TODO: MOSTRAR NOVAMENTE OS CARACTERES OMITIDOS
        let parteAntesDivisao_completa  = expressao.slice(0, posicaoDaDivisao);
        let parteDepoisDivisao_completa = expressao.slice(posicaoDaDivisao+1, expressao.length);

        return `d{${parteAntesDivisao_completa}} * ${parteDepoisDivisao_completa} - ${parteAntesDivisao_completa} * d{${parteDepoisDivisao_completa}} / ${ parteDepoisDivisao_completa }^2`;
    }
}

//function identificar_regras_cadeia
//vai ter que ir identificando sub-niveis como D1, D2, D3, etc... retornando a lista dos nomes dos termos identificados como D1, D2, e substituir no texto
//permite derivação por partes

//Deriva uma expressão que exise na tabela de derivadas. IDENTIFICA CASO A FUNÇÂO SEJA COMPOSTA
function derivar_expressao_por_tabela(expressao)
{
    let consultaTabela = validacoes.consultarTabela(expressao);
    let temNaTabela = consultaTabela != null ? true : false;
    let isFuncaoComposta = validacoes.isFuncaoComposta(expressao);

    //e^(alguma)
    let isE_elevado = expressao.slice(0, 4).trim().indexOf('e^') != -1 ? true : false;
    //caso geral do exponencial(podendo ser uma constante elevado a alguma coisa)
    let isConstante_elevado = expressao.slice(0, 4).trim().indexOf('^') != -1 ? true : false;


    let isX_elevado = ( (consultaTabela || {})['key'] || null) == '<alguma_coisa>^<outra_coisa>' ? true : false;
    let nomeCaso = ( (consultaTabela || {})['key'] || null),
        regraCaso = ( (consultaTabela || {})['value'] || null);

    let corpoDaFuncao;

    /**
    * Nao queremos que ele derive AQUI NESSA FUNÇÂO SE A EXPRESSAO TIVER SOMAS POR QUE AI PRECISA ESPERAR O PROXIMO NIVEL
    * Tipos isEmbalada:
    *    
    *   true - significa que a função está embalada de alguma forma
    *   false - significa que È UMA FUNÇÂO que pode possuir possui somas, subtrações ou multiplicações ou divisões no nivel atual
    */
    let isEmbalada = (
                       //fn( alguma_coisa )
                       utils.isInteiramenteDentroDeUmaFuncao(expressao) == true ||
                       //ex (uma_coisa)^alguma_coisa
                       utils.isEnvolvidaEmParentesesEUmaPotencia(expressao) == true ||
                       //ex (uma_coisa)
                       utils.isInteramenteEnvolvidaEmParenteses(expressao) == true ||
                       //ex fn( alguma_coisa )^alguma_coisa
                       utils.isInteiramenteDentroDeUmaFuncao_E_UmaPotencia(expressao) == true
                    );

    //TODO CHECAR SE È UMA FUNÇÂO DO TIPO SEN(2X) por exemplo QUE AI PRECISA DIZER QUE NÂO FOI DERIVADO POR TABELA

    //Se o começo da expressar estiver na tabela E SE NAO FOR UMA FUNCAO COMPOSTA
    if( temNaTabela == true && !isFuncaoComposta ){
        //let isE_elevado = expressao.slice(0, 4).trim().indexOf('e^') != -1 ? true : false;

        corpoDaFuncao = validacoes.extrairCorpoFuncaoNivelAtual(expressao, isE_elevado, isConstante_elevado);
        let corpoFuncaoSubstituido;

        //Se for estilo nome( argumento ), faz assim
        if( validacoes.temFuncao(expressao) && isE_elevado == false ){
            corpoFuncaoSubstituido = String(regraCaso).replace('<alguma_coisa>', corpoDaFuncao);
            return {
                original    : expressao,
                derivacao   : corpoFuncaoSubstituido,
                derivado    : true,
                tem_tabela  : temNaTabela,
                isE_elevado : isE_elevado,
                isConstante_elevado: isConstante_elevado
            }; //PRONTO

        //Se for e^<alguma_coisa>, que é um caso de exponencial
        }else if( isE_elevado == true ){
            corpoFuncaoSubstituido = corpoDaFuncao;
            return {
                original    : expressao,
                derivacao   : corpoFuncaoSubstituido,
                derivado    : true,
                tem_tabela  : temNaTabela,
                isE_elevado : isE_elevado,
                isConstante_elevado: isConstante_elevado
            }; //PRONTO

        //Se for termo_constante^<alguma_coisa> que tambem é um caso de exponencial
        //TODO: TALVES SEJA NECESSÁRIO APRIMORAR ESSA CONDIÇÂO PRA EVITAR PROBLEMAS, PRA ELE CONSEGUIR IDENTIFICAR QUANDO CAI NESSE CASO E QUANTO CAI NO DE BAIXO QUE PODE SER MUITO PARECIDO
        //AVISO: TALVES SEJA NECESSÁRIO APRIMORAR ESSA CONDIÇÂO PRA EVITAR PROBLEMAS, PRA ELE CONSEGUIR IDENTIFICAR QUANDO CAI NESSE CASO E QUANTO CAI NO DE BAIXO QUE PODE SER MUITO PARECIDO
        }else if( isE_elevado == false && isX_elevado == false && isConstante_elevado == true ){
            corpoFuncaoSubstituido = corpoDaFuncao;
            return {
                original    : expressao,
                derivacao   : corpoFuncaoSubstituido, //a derivada de uma constante^alguma_coisa continua sendo constante^alguma_coisa 
                derivado    : true,
                tem_tabela  : temNaTabela,
                isE_elevado : false,
                isConstante_elevado: true 
            }; //PRONTO

        //Se for <alguma_coisa>^<outra_coisa>
        //TODO/AVISO: essa condição pode ser confundida com a de cima, ATENÇÂO
        }else if( isX_elevado == true ){
            corpoFuncaoSubstituido = expressao;
            return {
                original    : expressao,
                derivacao   : regraCaso, //ja foi derivado o x^N
                derivado    : true,
                tem_tabela  : true,
                isE_elevado : false,
                isConstante_elevado: isConstante_elevado
            }; //PRONTO
        }

    //Se tiver na tabela E FOR UMA FUNÇÂO COMPOSTA E FOR EMBALADA
    }else if( temNaTabela == true && isFuncaoComposta == true && isEmbalada == true ){
        if( isFuncaoComposta == true ){
            corpoDaFuncao = validacoes.extrairCorpoFuncaoNivelAtual(expressao, isE_elevado, isConstante_elevado);
            let corpoFuncaoSubstituido;

            //Se for estilo nome( argumento ), faz assim
            if( validacoes.temFuncao(expressao) && isE_elevado == false ){
                corpoFuncaoSubstituido = String(regraCaso).replace('<alguma_coisa>', corpoDaFuncao);
                return {
                    original    : expressao,
                    derivacao   : corpoFuncaoSubstituido,
                    derivado    : true,
                    tem_tabela  : temNaTabela,
                    isE_elevado : isE_elevado
                }; //PRONTO

            //Se for e^<alguma_coisa>, que é um caso de exponencial
            }else if( isE_elevado == true ){
                corpoFuncaoSubstituido = corpoDaFuncao;
                return {
                    original    : expressao,
                    derivacao   : corpoFuncaoSubstituido,
                    derivado    : true,
                    tem_tabela  : temNaTabela,
                    isE_elevado : isE_elevado
                }; //PRONTO

            //Se for constante^<alguma_coisa>, que também é um caso de exponencial
            }else if( isE_elevado == false && isConstante_elevado == true ){
                corpoFuncaoSubstituido = corpoDaFuncao;
                return {
                    original    : expressao,
                    derivacao   : corpoFuncaoSubstituido, //a derivada de uma constante^alguma_coisa continua sendo constante^alguma_coisa 
                    derivado    : true,
                    tem_tabela  : temNaTabela,
                    isE_elevado : false,
                    isConstante_elevado: true
                }; //PRONTO

            //Se for <alguma_coisa>^<outra_coisa>
            }else if( isX_elevado == true ){
                corpoFuncaoSubstituido = expressao;
                return {
                    original    : expressao,
                    derivacao   : regraCaso, //ja foi derivado o x^N
                    derivado    : true,
                    tem_tabela  : true,
                    isE_elevado : false
                }; //PRONTO
            }

            //TODO
            /*
            return {
                original    : expressao,
                derivacao   : `d{ ${expressao} }`,
                derivado    : false,
                tem_tabela  : temNaTabela,
                isE_elevado : isE_elevado
            };*/
        }

    //SE NÂO TIVER NA TABELA E FOR UMA FUNÇÂO COMPOSTA E NÃO É EMBALADA
    }else if( temNaTabela == true && isFuncaoComposta == true && isEmbalada == false ){
        return {
            original    : expressao,
            derivacao   : `d{ ${expressao} }`,
            derivado    : false,
            tem_tabela  : false,
            isE_elevado : false
        };

    //SE NAO TIVER NA TABELA E FOR UMA FUNÇÂO COMPOSTA
    }else if( temNaTabela == false && isFuncaoComposta == true ){
        return {
            original    : expressao,
            derivacao   : `d{ ${expressao} }`,
            derivado    : false,
            tem_tabela  : false,
            isE_elevado : false
        };
    }
}

function tratar_espacos(expression) {
    // Remover espaços antes e depois do operador '*'
    expression = expression.replace(/\s*\*\s*/g, ' * ');
    
    // Remover múltiplos espaços em outras partes da expressão
    expression = expression.replace(/\s+/g, ' ');
    
    // Remover espaços no início e no fim da string
    return expression.trim();
}

//TODO: função que vai extrair apenas AS CONSTANTES QUE ESTIVEREM SENDO MULTIPLICADAS OU DIVIDIDAS PELOS TERMOS(nao constantes)
function costantes_se_manter(termos, sinais, regras, emRelacao){
    let constantes             = [];
    let algumTeveDivisao       = false;
    let algumTeveMultiplicacao = false;

    //Para cada termo(separado)
    for( let i = 0 ; i < termos.length ; i++ )
    {
        //Desmembra as informações uteis
        let termo = termos[i];

        //tambem ignora OS ZEROS PRODUZIDOS PELA FUNÇÂO remover_constantes_que_zeram
        if( termo != '$' )
        {
            //Omite os termos de niveis internos ao nivel atual, para facilitar a identificação de regra do produto e regra do quociente
            let termo_niveis_internos_omitidos = validacoes.omitirNiveisAbaixoNivelAtual(termo);

            //Identifica se tem constante MULTIPLICANDO OU DIVIDINDO no nivel atual
            let temMultiplicao = termo_niveis_internos_omitidos.indexOf('*') != -1,
                temDivisao     = termo_niveis_internos_omitidos.indexOf('/') != -1;
            
            //Se algum teve divisão, sinaliza que sim
            if( temDivisao == true ){ algumTeveDivisao = true };
            //Se algum teve multiplicação, sinaliza que sim
            if( temMultiplicao == true ){ algumTeveMultiplicacao = true };


            let multiplicacoes_e_divisoes = []; 
            let strAtual = '';

            let termo_tratado = utils.substituirTudo( String(termo_niveis_internos_omitidos), '*', '_' );
            termo_tratado = utils.substituirTudo( String(termo_tratado), '/', '_' );

            //Cria uma lista com os termos(que estão multiplicando ou dividindo)
            multiplicacoes_e_divisoes = termo_tratado.split('_');

            //Faz um trim em todas
            for( let j = 0 ; j < multiplicacoes_e_divisoes.length ; j++ )
            {
                multiplicacoes_e_divisoes[j] = multiplicacoes_e_divisoes[j].trim();
            }

            //Obtem os indices(posições do texto) onde tinham simbolos de multiplicação ou divisão que coloquei como _
            let indicesSeparacao = utils.getIndexesOf( termo_tratado , '_' );

            let termos_desmascarados = []; //Os termos que estão multiplicando OU dividindo, DESMASCARADOS
            let indiceAtual = 0;
            let terminou = false;
            let ultima = false;
            let parteAtual = '';

            let inicial = 0;
            let final = indicesSeparacao[0];

            while(terminou == false)
            {
                parteAtual = termo.slice(inicial, final);
                termos_desmascarados.push(parteAtual.trim());

                if( ultima == true ){
                    terminou = true;
                    break;
                }

                inicial = final+1;
                indiceAtual++;
                final = indicesSeparacao[indiceAtual];

                if( final == undefined )
                {   
                    inicial = indicesSeparacao[indiceAtual-1]+1;
                    final = termo.length;
                    ultima = true;
                }
            }

            //Quais dessas são constantes multiplicando OU dividindo
            let constantes_este_termo = [];
            for( let j = 0 ; j < termos_desmascarados.length ; j++ )
            {
                const tem_divisao_logo_atraz        = String(termo).slice( termo.indexOf(termos_desmascarados[j])-4, termo.indexOf(termos_desmascarados[j]) ).indexOf('/') != -1;
                const tem_multiplicacao_logo_atraz  = String(termo).slice( termo.indexOf(termos_desmascarados[j])-4, termo.indexOf(termos_desmascarados[j]) ).indexOf('*') != -1;
                const tem_divisao_logo_apos         = String(termo).slice( termo.indexOf(termos_desmascarados[j]), termo.indexOf(termos_desmascarados[j])+4 ).indexOf('/') != -1;
                const tem_multiplicacao_logo_apos   = String(termo).slice( termo.indexOf(termos_desmascarados[j]), termo.indexOf(termos_desmascarados[j])+4 ).indexOf('*') != -1;
                const pedacinho_atraz               = String(termo).slice( termo.indexOf(termos_desmascarados[j])-10, termo.indexOf(termos_desmascarados[j]) );
                const pedacinho_apos                = String(termo).slice( termo.indexOf(termos_desmascarados[j]), termo.indexOf(termos_desmascarados[j])+10 );
                const caracter_atraz                = tem_divisao_logo_atraz == true ? '/' : tem_multiplicacao_logo_atraz == true ? '*' : null
                const posicao_termo                 = termo.indexOf(termos_desmascarados[j]) < termo.length/2 ? 'comeco_termo' : 'final_termo';
                const is_primeira                   = posicao_termo == 'comeco_termo' && caracter_atraz == null ? true : false;

                //SE FOR CONSTANTE(SE NAO TEM A VARIAVEL)
                if( termos_desmascarados[j].indexOf(emRelacao) == -1 
                    //IGNORA OS ZEROS PRODUZIDOS PELA FUNÇÂO remover_constantes_que_zeram
                    && termos_desmascarados[j] != '$'
                ){
                    constantes_este_termo.push({
                        constante                    : termos_desmascarados[j],
                        posicao_termo                : posicao_termo,
                        tem_divisao_logo_atraz       : tem_divisao_logo_atraz,
                        tem_multiplicacao_logo_atraz : tem_multiplicacao_logo_atraz,
                        tem_divisao_logo_apos        : tem_divisao_logo_apos,
                        tem_multiplicacao_logo_apos  : tem_multiplicacao_logo_apos,
                        pedacinho_atraz              : pedacinho_atraz,
                        pedacinho_apos               : pedacinho_apos,
                        caracter_atraz               : caracter_atraz,
                        is_primeira                  : is_primeira
                    });
                }
            }

            //TODO: BUG ELE CORTA OS TERMOS
            //EX costantes_se_manter(['e^(j45) * cos(y*x+5)'], [], [], 'x') TA RETORNANDO  ['e^(j45) ', '* cos(y*x'] CORTANDO O FINAL

            //NOTA: pode ter mais de uma multiplicação, ou divisão. Pode ter divisao e multiplicacao.
            //NOTA: pode estar ANTES ou DEPOIS do termo, um ou mais

            //tambem ignora OS ZEROS PRODUZIDOS PELA FUNÇÂO remover_constantes_que_zeram
            if( termo != '$' )
            {
                constantes.push({
                    termo                   : termo,
                    constantes_no_termo     : constantes_este_termo,
                    teve_divisao            : algumTeveDivisao, //Se algum deles teve divisão envolvido
                    teve_multiplicacao      : algumTeveMultiplicacao, //Se algum deles teve divisão envolvido
                    somente_multiplicacao   : algumTeveDivisao == false && algumTeveMultiplicacao == true, //Se todos foram multiplicacao
                    somente_divisao         : algumTeveDivisao == true && algumTeveMultiplicacao == false, //Se todos foram divisao
                    qtde_divisoes           : utils.contarCaracter(termo_niveis_internos_omitidos, '/'),
                    qtde_multiplicacoes     : utils.contarCaracter(termo_niveis_internos_omitidos, '*'),

                    //os sinais constantes é assim: qual caracter que vem antes da constante na posicao I do array. 
                    sinais_antes_constantes : constantes_este_termo.map(( constante )=>{ return constante['caracter_atraz'] })
                }) 
            }

        //Se for uma constante(que vai ser tratado como ZERO)
        }else{
            constantes.push({
                termo                   : termo,
                constantes_no_termo     : null,
                teve_divisao            : null,
                teve_multiplicacao      : null, 
                somente_multiplicacao   : null,
                somente_divisao         : null,
                qtde_divisoes           : null,
                qtde_multiplicacoes     : null,
                sinais_antes_constantes : null
            }) 
        }
    }
    
    return constantes;
}

//Remove as constantes(DA LISTA DE CONSTANTES PASSADA COMO ARGUMENTO) dos termos atuais
function retirar_constantes(termosAtuais, constantesAtuais){
    let constantesRemovidas_termoAtual = [];

    //Para cada termo
    for( let k = 0 ; k < termosAtuais.length ; k++ )
    {
        let termo = termosAtuais[k];

        //tambem ignora OS ZEROS PRODUZIDOS PELA FUNÇÂO remover_constantes_que_zeram
        if( termo != '$' )
        {
            let termo_tratar = String(termo);

            //Um termo pode ter varias constantes
            let dadosConstantes = constantesAtuais.filter((constante)=>{
                if( constante['termo'] == termo )
                {
                    return constante;
                }

            })[0];

            let constantesTermo = dadosConstantes['constantes_no_termo'].map( (constante)=>{
                return {
                    constante: constante['constante'],
                    dados: constante
                };
            } );

            //TODO: BUG, PRECISA REMOVER NAO SÒ AS CONSTANTES MAIS TAMBEM O SIMBOLO DE MULTIPLICACAO DELAS
            //JA FOI CORRIGIDO TESTAR MELHOR
            constantesTermo.forEach(function(objConstante, indiceIteracao){
                const strConstante = objConstante['constante'],
                    dados        = objConstante['dados'];

                if( dados['caracter_atraz'] == '*' ){
                    termo_tratar = termo_tratar.replace(' * ' + strConstante, strConstante);

                }else if( dados['caracter_atraz'] == '/' ){
                    termo_tratar = termo_tratar.replace(' / ' + strConstante, strConstante);
                }

                termo_tratar = termo_tratar.replace(strConstante, '');
            });

            let termo_tratar_splitted = termo_tratar.split(' ');

            //Verificar se não sobrou simbolos de multiplicacao e divisao sozinhos no comeco da string
            //TODO: BUG, NO INICIO SEMPRE FICA CARACTERES DE MULTIPLICAÇAO OU DIVISAO SOZINHOS, POIS APOS AS CONTASTANTES DO INICIO VEM COISAS QUE NAO SAO CONSTANTES E AI O CODIGO NAO RETIRA POR QUE ELE ACHA QUE FAZ PARTE DA EXPRESSAO
            /* CONTINUAR ESSE CÒDIGO
            for( let m = 0 ; m < termo_tratar_splitted.length ; m++ ){
                //TODO: identificar se tem um simbolo de multiplicacao ou divisao QUE ANTES DELE ESTEJA TUDO STRING VAZIA
                //E QUE, LOGO NA FRENTE DELE TENHA UM TERMO QUE NÂO È CONSTANTE
                //E È MAIS NO COMEÇO DA EXPRESSÂO QUE ISSO OCORRE
            
                let indiceIteracao = m;
                let caracterAtual = termo_tratar_splitted[indiceIteracao];

                if( 
                    //Se estiver no inicio
                    indiceIteracao <= termo_tratar.length/2 
                    //Se for um simbolo de multiplicação ou divisão
                    && (caracterAtual == '*' || caracterAtual == '/')
                    //Se atraz dele só tem uma string vazia
                    && termo_tratar.slice(0, indiceIteracao).split(' ').every((c)=>{ return c == '' }) == true 
                    //Se na frente dele tem algo que não é constante
                    && termo_tratar.slice(indiceIteracao, termo_tratar.length).split(' ').some((c)=>{ return c.indexOf(emRelacao) != -1 }) == true 
                ){
                    
                }
            }*/

            constantesRemovidas_termoAtual.push( termo_tratar ); 

        //Se for o simbolo $(que constante que vai ser tratado como ZERO)
        }else{
            constantesRemovidas_termoAtual.push('constante'); 
        }
    }

    return constantesRemovidas_termoAtual;
}

//Nos termos, identifica quais constantes estão sendo somadas ou substraidas, pois elas vão se tornar zero
function constantes_que_zeram(termos, emRelacao){
    let constantes             = [];
    let algumTeveSoma       = false;
    let algumTeveSubtracao  = false;

    //Para cada termo(separado)
    for( let i = 0 ; i < termos.length ; i++ )
    {
        //Desmembra as informações uteis
        let termo = termos[i];

        //Omite os termos de niveis internos ao nivel atual, para facilitar a identificação de regra do produto e regra do quociente
        let termo_niveis_internos_omitidos = validacoes.omitirNiveisAbaixoNivelAtual(termo);

        //Identifica se tem constante MULTIPLICANDO OU DIVIDINDO no nivel atual
        let temSoma      = termo_niveis_internos_omitidos.indexOf('+') != -1,
            temSubtracao = termo_niveis_internos_omitidos.indexOf('-') != -1;
        
        //Se algum teve soma, sinaliza que sim
        if( temSoma == true ){ algumTeveSoma = true };
        //Se algum teve subtracao, sinaliza que sim
        if( temSubtracao == true ){ algumTeveSubtracao = true };


        let somas_e_subtracoes = []; 
        let strAtual = '';

        let termo_tratado = utils.substituirTudo( String(termo_niveis_internos_omitidos), '+', '_' );
        termo_tratado = utils.substituirTudo( String(termo_tratado), '-', '_' );

        //Cria uma lista com os termos(que estão somando ou subtraindo)
        somas_e_subtracoes = termo_tratado.split('_');

        //Faz um trim em todas
        for( let j = 0 ; j < somas_e_subtracoes.length ; j++ )
        {
            somas_e_subtracoes[j] = somas_e_subtracoes[j].trim();
        }

        //Obtem os indices(posições do texto) onde tinham simbolos de multiplicação ou divisão que coloquei como _
        let indicesSeparacao = utils.getIndexesOf( termo_tratado , '_' );

        let termos_desmascarados = []; //Os termos que estão multiplicando OU dividindo, DESMASCARADOS
        let indiceAtual = 0;
        let terminou = false;
        let ultima = false;
        let parteAtual = '';

        let inicial = 0;
        let final = indicesSeparacao[0];

        while(terminou == false)
        {
            parteAtual = termo.slice(inicial, final);
            termos_desmascarados.push(parteAtual.trim());

            if( ultima == true ){
                terminou = true;
                break;
            }

            inicial = final+1;
            indiceAtual++;
            final = indicesSeparacao[indiceAtual];

            if( final == undefined )
            {   
                inicial = indicesSeparacao[indiceAtual-1]+1;
                final = termo.length;
                ultima = true;
            }
        }

        //Quais dessas são constantes multiplicando OU dividindo
        let constantes_este_termo = [];
        for( let j = 0 ; j < termos_desmascarados.length ; j++ )
        {
            const tem_soma_logo_atraz           = String(termo).slice( termo.indexOf(termos_desmascarados[j])-4, termo.indexOf(termos_desmascarados[j]) ).indexOf('+') != -1;
            const tem_subtracao_logo_atraz      = String(termo).slice( termo.indexOf(termos_desmascarados[j])-4, termo.indexOf(termos_desmascarados[j]) ).indexOf('-') != -1;
            const tem_soma_logo_apos            = String(termo).slice( termo.indexOf(termos_desmascarados[j]), termo.indexOf(termos_desmascarados[j])+4 ).indexOf('+') != -1;
            const tem_subtracao_logo_apos       = String(termo).slice( termo.indexOf(termos_desmascarados[j]), termo.indexOf(termos_desmascarados[j])+4 ).indexOf('-') != -1;
            const pedacinho_atraz               = String(termo).slice( termo.indexOf(termos_desmascarados[j])-10, termo.indexOf(termos_desmascarados[j]) );
            const pedacinho_apos                = String(termo).slice( termo.indexOf(termos_desmascarados[j]), termo.indexOf(termos_desmascarados[j])+10 );
            const caracter_atraz                = tem_soma_logo_atraz == true ? '+' : tem_subtracao_logo_atraz == true ? '-' : null;
            const posicao_termo                 = termo.indexOf(termos_desmascarados[j]) < termo.length/2 ? 'comeco_termo' : 'final_termo';
            const is_primeira                   = posicao_termo == 'comeco_termo' && caracter_atraz == null ? true : false;

            //SE FOR CONSTANTE(SE NAO TEM A VARIAVEL)
            if( termos_desmascarados[j].indexOf(emRelacao) == -1 )
            {
                constantes_este_termo.push({
                    constante                    : termos_desmascarados[j],
                    posicao_termo                : posicao_termo,
                    tem_soma_logo_atraz          : tem_soma_logo_atraz,
                    tem_subtracao_logo_atraz     : tem_subtracao_logo_atraz,
                    tem_soma_logo_apos           : tem_soma_logo_apos,
                    tem_subtracao_logo_apos      : tem_subtracao_logo_apos,
                    pedacinho_atraz              : pedacinho_atraz,
                    pedacinho_apos               : pedacinho_apos,
                    caracter_atraz               : caracter_atraz,
                    is_primeira                  : is_primeira
                });
            }
        }

        constantes.push({
            termo                     : termo,
            constantes_no_termo       : constantes_este_termo,
            teve_soma                 : algumTeveSoma, //Se algum deles teve divisão envolvido
            teve_subtracao            : algumTeveSubtracao, //Se algum deles teve divisão envolvido
            somente_soma              : algumTeveSubtracao == false && algumTeveSoma == true, //Se todos foram somas
            somente_subtracao         : algumTeveSubtracao == true && algumTeveSoma == false, //Se todos foram subtracoes
            qtde_somas                : utils.contarCaracter(termo_niveis_internos_omitidos, '+'),
            qtde_subtracoes           : utils.contarCaracter(termo_niveis_internos_omitidos, '-'),

            //os sinais constantes é assim: qual caracter que vem antes da constante na posicao I do array. 
            sinais_antes_constantes   : constantes_este_termo.map(( constante )=>{ return constante['caracter_atraz'] })
        }) 

    }

    return constantes;
}


//DENTRO DO NIVEL ATUAL DO TERMO ATUAL, Usa o resultado da funçao anterior para poder transformar as CONSTANTES SENDO SOMADAS EM ZERO
function remover_constantes_que_zeram(termo_string_param, constantesSomandoSubtraindo){
    let termo_string = String(termo_string_param);

    //Para cada termo da lista de constantesSomandoSubtraindo
    for( let k = 0 ; k < constantesSomandoSubtraindo.length ; k++ )
    {
        //Obtem as informações sobre as contantes desse termo
        let info_constanteAtual = constantesSomandoSubtraindo[k];
        let constantes_array    = info_constanteAtual['constantes_no_termo'];

        //Vai tratando TRANSFORMANDO EM ZERO
        constantes_array.forEach(function(infoConstante){
            let constante = infoConstante['constante'],
                dados     = infoConstante;

            //pega a expressao do termo I, e subtitui cada constante por zero
            termo_string = String(termo_string).replace(constante, '$');
        });
    }

    //Uma lista de termos

    //Para cada termo
    /*
    for( let i = 0 ; i < termos.length ; i++ )
    {
        ... codigo que estava aqui
        let termo = termos[i];
    }*/

    return termo_string;
}

//Maneiras para identificar/destacar os termos que vamos derivar com as regras
function forma_identificar(termos, sinais, regras, emRelacao){
    let termosIdentificados_array  = [];
    let termosIdentificados_string = '';

    for( let i = 0 ; i < termos.length ; i++ )
    {
        //Desmembra as informações uteis
        let termo = termos[i];
        let sinal = sinais[i];
        let regra = regras[i];

        //Omite os termos de niveis internos ao nivel atual, para facilitar a identificação de regra do produto e regra do quociente
        let termo_niveis_internos_omitidos = validacoes.omitirNiveisAbaixoNivelAtual(termo);

        //Maneiras de identificar(casos)
        let identificado = '';
        switch(regra){
            case 'regra_produto':
                identificado = tratar_espacos( identificacoes.identificar_regra_produto(termo, termo_niveis_internos_omitidos, emRelacao) );
                termosIdentificados_array.push( identificado );
                break;

            case 'regra_quociente':
                identificado = tratar_espacos( identificacoes.identificar_regra_quociente(termo_niveis_internos_omitidos, emRelacao) );
                termosIdentificados_array.push( identificado );
                break;

            case 'regra_cadeia':
                identificado = tratar_espacos( identificacoes.identificar_regra_cadeia(termo, emRelacao) );
                termosIdentificados_array.push( identificado );
                break;

            case 'tabela_ou_nada':
                //se não tem a variavel emRelacao é tudo constante
                if( termo.indexOf(emRelacao) == -1 ){
                    identificado = termo;
                    termosIdentificados_array.push( `constante{${identificado}}` );

                }else{
                    identificado = termo;
                    termosIdentificados_array.push( `nenhum{${identificado}}` );
                }
                break;

            default:
                break;            
        }

        termosIdentificados_string += String(identificado) + ' ' + String(sinal != null ? sinal : '') + ' ';
    }

    return {
        identificacos       : termosIdentificados_array,
        emString            : termosIdentificados_string,
        sinais              : sinais,
        regras              : regras
    };
}

function derivar_expressao_por_etapas(expressao, emRelacao='x'){
    
    //Identifica as CONSTANTES SENDO SOMADAS OU SUBTRAIDAS
    let constantes_que_vao_zerar = constantes_que_zeram([expressao], emRelacao);

    //TODO: transformar as contantes somando ou subtraindo em zeros
    let expressao_constantes_somandosubtraindo_removidas = remover_constantes_que_zeram(expressao, constantes_que_vao_zerar);

    //Olha para o nivel atual(que é a expressão em string)
    let nivelAtual = expressao_constantes_somandosubtraindo_removidas;

    //loop
    let acabou = false;
    let iteracoes = 0;
    while(!acabou)
    {
        //identificar a regra do nivel atual
        let identificarRegrasNivel = validacoes.identificarRegraMaisExterna(nivelAtual, emRelacao);

        let nomesRegrasAtual       = identificarRegrasNivel['regras'],
            sinaisRegrasAtual      = identificarRegrasNivel['sinais'],
            termosAtual            = identificarRegrasNivel['termos_usados'],
            expressaoOriginal      = identificarRegrasNivel['expressao'];

        //identificar os termos
        let constantes_se_manter        = costantes_se_manter(termosAtual, sinaisRegrasAtual, nomesRegrasAtual, emRelacao);
        //Deixa os Termos sem as contantes que multiplicam(pois vão ser colocadas mais para o final)
        let termosAtual_sem_constantes  = retirar_constantes(termosAtual, constantes_se_manter, emRelacao);

        //Remove das constantes os simbolos isolados(isso é, das que constantes que estão multiplicando ou dividindo, alguns simbolos que ficaram soltos por ai antes ou depois do termo) QUE ESTÂO ISOLADAS/SOZINHAS
        let termosAtual_sem_constantes_tratado_sem_isolados = [... termosAtual_sem_constantes];
        for( let p = 0 ; p < termosAtual_sem_constantes.length ; p++ )
        {
            let termosAtual_sem_constantes_atual = termosAtual_sem_constantes[p];
            
            let termosAtual_sem_constantes_atual_omitido = validacoes.omitirNiveisAbaixoNivelAtual(termosAtual_sem_constantes_atual);
            let simbolos_isolados = utils.removerSimbolosMultiplicacaoDivisaoIsolados(termosAtual_sem_constantes_atual_omitido);
            let termosAtual_sem_constantes_sem_simbolos_isolados = utils.removerPartesDeUmaString(String(termosAtual_sem_constantes_atual), simbolos_isolados);
            
            //Escreve o termosAtual_sem_constantes_atual
            termosAtual_sem_constantes_tratado_sem_isolados[p] = String(termosAtual_sem_constantes_sem_simbolos_isolados);
        }
    
        //Da sequencia ao processamento
        let nivel_termos_identificados  = forma_identificar(termosAtual_sem_constantes_tratado_sem_isolados, sinaisRegrasAtual, nomesRegrasAtual, emRelacao);

        //Tratar cada termo identificado para remover parenteses ) incorretos(caso haja parenteses ) que não foi foram abertos)
        let nivel_termos_identificados_parenteses_tratado = [... nivel_termos_identificados['identificacos']];
        for( let p = 0 ; p < nivel_termos_identificados['identificacos'].length ; p++ )
        {
            let termo_identific_atual =  nivel_termos_identificados['identificacos'][p];

            //Se nao for uma constante
            if( termo_identific_atual != 'constante' && termo_identific_atual != 'constante{constante}' )
            {
                nivel_termos_identificados_parenteses_tratado[p] = utils.removeUnmatchedParentheses( termo_identific_atual )['string_removida'];
            }
        }

        let termos_identificados        = nivel_termos_identificados_parenteses_tratado,
            termos_identificados_str    = nivel_termos_identificados['emString'].trim(),
            termos_identificados_sinais = nivel_termos_identificados['sinais'],
            termos_identificados_regras = nivel_termos_identificados['regras'];


        //TODO: voltar as constantes removidas(que estão multiplicando ou dividindo)
        
        //debugger;

        //let termos_deriv_separados = validacoes.get_derivacoes_identificadas( nivel_termos_identificados, emRelacao );

        //TODO: identificar as derivacoes que vão ser necessárias resolver
        let ID_MAP = {};
        for( let p = 0 ; p < termos_identificados.length ; p++ )
        {
            let termo_pai_precisa_derivar = termos_identificados[p];

            //SE NÂO È UMA CONSTANTE sendo somada/subtraida QUE VAI ZERAR
            if(termo_pai_precisa_derivar.indexOf('constante') == -1)
            {
                let dados_derivacoesTermoAtual = utils.identificar_termos_precisa_derivar( termo_pai_precisa_derivar );
                let termos_precisa_derivar_derivacoesTermoAtual = dados_derivacoesTermoAtual['identificacoes'];
                let sinais_derivacoesTermoAtual = dados_derivacoesTermoAtual['sinais'];

                if(ID_MAP[termo_pai_precisa_derivar] == undefined){
                    ID_MAP[termo_pai_precisa_derivar] = {};
                }

                //Duas representações para a mesma coisa
                let array_derivacoes_nomeadas = [];
                let json_derivacoes_nomeadas = {};

                let ids_gerados = [];
                let itens = [];
                for(let n = 0 ; n < termos_precisa_derivar_derivacoesTermoAtual.length ; n++)
                {
                    let este_termo = termos_precisa_derivar_derivacoesTermoAtual[n];
                    let id_este_termo_n = utils.nextId('deriv');

                    json_derivacoes_nomeadas[id_este_termo_n] = {
                        id: id_este_termo_n,
                        termo: este_termo,
                        sinal: sinais_derivacoesTermoAtual[n]
                    };

                    array_derivacoes_nomeadas.push({
                       id: id_este_termo_n,
                       termo: este_termo,
                       sinal_apos: sinais_derivacoesTermoAtual[n]
                    });

                    ids_gerados.push(id_este_termo_n);
                    itens.push(este_termo);
                }

                ID_MAP[termo_pai_precisa_derivar]['vai_derivar'] = array_derivacoes_nomeadas;
                ID_MAP[termo_pai_precisa_derivar]['vai_derivar_mapped'] = json_derivacoes_nomeadas;
                ID_MAP[termo_pai_precisa_derivar]['sinais_apos'] = sinais_derivacoesTermoAtual;
                ID_MAP[termo_pai_precisa_derivar]['ids'] = ids_gerados
                ID_MAP[termo_pai_precisa_derivar]['termos'] = itens

            //SE FOR CONSTANTE, IGNORA
            }else{

            }
        }
        
        //PERCORRER CADA TERMO, E SUBSTITUIR ELE PELOS IDs
        let termos_substituidos_pelos_ids = []; 
        for( let p = 0 ; p < termos_identificados.length ; p++ )
        {
            let termo_precisa_substituir = String(termos_identificados[p]);

            //SE NÂO È UMA CONSTANTE sendo somada/subtraida QUE VAI ZERAR
            if(termo_precisa_substituir.indexOf('constante') == -1)
            {
                //ler a lista de derivações DO TERMO pra substituir
                let dados_IDs_derivacoes_termo_atual = ID_MAP[ termo_precisa_substituir ];
                let lista_substituir = dados_IDs_derivacoes_termo_atual['vai_derivar'];

                lista_substituir.forEach(function(item_atual, indice_item){
                    let id_termo = item_atual['id'];
                    let str_termo = item_atual['termo'];
                    termo_precisa_substituir = utils.substituirTudo(termo_precisa_substituir, str_termo, id_termo );
                });

                termos_substituidos_pelos_ids.push(termo_precisa_substituir);

            //SE É CONSTANTE
            }else{  
                //mantem exatamente como veio
                termos_substituidos_pelos_ids.push('constante');
            }
        }

        /**
        * Obtem a lista bruta contendo ID_DERIVACAO: TERMO_IDENTIFICADO 
        */
        let lista_bruta_derivacoes_fazer = [];
        let mapa_derivacoes_fazer = {};
        for( let p = 0 ; p < termos_identificados.length ; p++ )
        {
            const nome_termo = termos_identificados[ p ];
            const regra_identificada = termos_identificados_regras[p];
            const dados_termo = ID_MAP[ nome_termo ];

            if( nome_termo != 'constante' && nome_termo != 'constante{constante}' )
            {
                const keys_derivar_mapped = Object.keys( dados_termo.vai_derivar_mapped );

                for( let v = 0 ; v < keys_derivar_mapped.length ; v++ )
                {
                    const keyDerivarMap = keys_derivar_mapped[v];
                    const objMap = {
                        key: keyDerivarMap, 
                        id: dados_termo.vai_derivar_mapped[ keyDerivarMap ]['id'],
                        termo: dados_termo.vai_derivar_mapped[ keyDerivarMap ]['termo'],
                        termo_sem_chaves: utils.extrairConteudoEntreChaves( dados_termo.vai_derivar_mapped[ keyDerivarMap ]['termo'] ),
                        sinal: dados_termo.vai_derivar_mapped[ keyDerivarMap ]['sinal'],
                        _info: dados_termo.vai_derivar_mapped[ keyDerivarMap ]
                    };

                    mapa_derivacoes_fazer[keyDerivarMap] = objMap;
                    lista_bruta_derivacoes_fazer.push(objMap);
                }
            }
        }

        //TODO: visto que ja temos as derivações de cada termo devidamente separadas, vamos resolver uma por uma

        /*
        TODO: Criar uma forma de derivar cada termo corretamente, sem dar erros
        */
        let termos_derivados_nivel_atual = [];
        for( let p = 0 ; p < lista_bruta_derivacoes_fazer.length ; p++ )
        {
            let dados_derivar = lista_bruta_derivacoes_fazer[p];
            let termo_derivar = dados_derivar['termo_sem_chaves'];
            let id_termo_derivar = dados_derivar['id'];
            let sinal_termo_derivar = dados_derivar['sinal'];

            //Deriva o termo se não for constante
            if( termo_derivar != 'constante' && termo_derivar != 'constante{constante}' ){
                let expressao_atual_derivada = derivar_expressao_por_tabela( termo_derivar );
                expressao_atual_derivada['id_derivacao'] = id_termo_derivar;
                expressao_atual_derivada['sinal'] = sinal_termo_derivar;
                termos_derivados_nivel_atual.push( expressao_atual_derivada );
                
            //se for constante
            }else{
                termos_derivados_nivel_atual.push( 'constante' );
            }
        }
        
        /**
        * Mapear as derivações feitas
        * ID_DERIVACAO : RESULTADO_DERIVACAO 
        */
        let lista_bruta_derivacoes_prontas = [];
        let mapa_derivacoes_prontas = {};
        for( let p = 0 ; p < termos_derivados_nivel_atual.length ; p++ )
        {
            let id_derivacao_lendo    = termos_derivados_nivel_atual[p]['id_derivacao'];
            let dados_derivacao_lendo = termos_derivados_nivel_atual[p];

            let dados_colocar = {
                id: id_derivacao_lendo,
                derivacao: termos_derivados_nivel_atual[p]['derivacao'],
                original: termos_derivados_nivel_atual[p]['original'],
                derivado: termos_derivados_nivel_atual[p]['derivado'],

                //todos os outros dados extras
                _info: dados_derivacao_lendo
            }

            mapa_derivacoes_prontas[ id_derivacao_lendo ] = dados_colocar;
            lista_bruta_derivacoes_prontas.push(dados_colocar);
        }

        //TODO: Identificar dos termos SEM CONSTANTE OS TERMOS COM AS CONTANTES PRA PODER VINCULAR A INFORMAÇÂO DAS CONSTANTES QUE SE MANTEM
        //PARA CADA TERMO COM CONSTANTE, VOU REMOVER AS CONTANTES E CHECAR SE È EXATAMENTE IGUAL AO TERMO SEM CONSTANTE
        let tabela_termos_sem_constantes_com_constante = {};
        let tabela_com_constante_com_sem_constante = {};
        for( let p = 0 ; p < termosAtual.length ; p++ )
        {
            let termo_vai_tratar_pra_checar = String( termosAtual[p] );
            let termo_vai_tratar_pra_checar_OLD = String(termo_vai_tratar_pra_checar);

            //Se não for uma constante que está sendo somada ou subtraida
            if( termo_vai_tratar_pra_checar != 'constante' && termo_vai_tratar_pra_checar != '$' )
            {
                termo_vai_tratar_pra_checar = retirar_constantes([termo_vai_tratar_pra_checar], constantes_se_manter, emRelacao);

                //Remove das constantes os simbolos isolados(isso é, das que constantes que estão multiplicando ou dividindo, alguns simbolos que ficaram soltos por ai antes ou depois do termo) QUE ESTÂO ISOLADAS/SOZINHAS
                for( let p1 = 0 ; p1 < termo_vai_tratar_pra_checar.length ; p1++ )
                {
                    let termosAtual_sem_constantes_atual_p1 = termo_vai_tratar_pra_checar[p1];

                    let termosAtual_sem_constantes_atual_omitido_p1 = validacoes.omitirNiveisAbaixoNivelAtual(termosAtual_sem_constantes_atual_p1);
                    let simbolos_isolados_p1 = utils.removerSimbolosMultiplicacaoDivisaoIsolados(termosAtual_sem_constantes_atual_omitido_p1);
                    let termosAtual_sem_constantes_sem_simbolos_isolados_p1 = utils.removerPartesDeUmaString(String(termosAtual_sem_constantes_atual_p1), simbolos_isolados_p1);
                    
                    //Escreve o termosAtual_sem_constantes_atual
                    termo_vai_tratar_pra_checar[p1] = String(termosAtual_sem_constantes_sem_simbolos_isolados_p1);
                }

                termo_vai_tratar_pra_checar = termo_vai_tratar_pra_checar[0];

                tabela_termos_sem_constantes_com_constante[ termo_vai_tratar_pra_checar ] = termo_vai_tratar_pra_checar_OLD;
                tabela_com_constante_com_sem_constante[ termo_vai_tratar_pra_checar_OLD ] = termo_vai_tratar_pra_checar;
            }
        }

        //TODO: Mapear TERMO: CONSTANTES_MULTIPLICANDO_OU_DIVIDINDO pra organizar melhor e facilitar na hora de colocar de volta elas nos termos
        let CONSTANTES_MULTIPLICANDO_OU_DIVIDINDO_TERMOS = [];
        let tabela_CONSTANTES_MULTIPLICANDO_OU_DIVIDINDO_TERMOS = {};
        for( let p = 0 ; p < constantes_se_manter.length ; p++ )
        {
            let dados_constante_mantendo = constantes_se_manter[p];
            let termo_constante_mantendo = dados_constante_mantendo['termo'];

            //Localiza qual o termo que TEM AS CONSTANTES QUE PRECISA SE MANTER
            let termo_que_possui_essas_constantes = tabela_com_constante_com_sem_constante[termo_constante_mantendo] || undefined;
            
            let dados_inserir = {
                termo                   :  termo_constante_mantendo,
                termo_sem_constantes    :  termo_que_possui_essas_constantes,
                constantes_no_termo     :  dados_constante_mantendo['constantes_no_termo'],
                sinais_antes_constantes :  dados_constante_mantendo['sinais_antes_constantes'],
                teve_divisao            :  dados_constante_mantendo['teve_divisao'],
                teve_multiplicacao      :  dados_constante_mantendo['teve_multiplicacao'],
                somente_divisao         :  dados_constante_mantendo['somente_divisao'],
                somente_multiplicacao   :  dados_constante_mantendo['somente_multiplicacao'],
                qtde_divisoes           :  dados_constante_mantendo['qtde_divisoes'],
                qtde_multiplicacoes     :  dados_constante_mantendo['qtde_multiplicacoes'],
                tem_constantes          :  (dados_constante_mantendo['constantes_no_termo'] || []).length > 0 ? true : false,

                //dados extra
                _info                   :  dados_constante_mantendo
            }

            //Se existir uma entrada para esse termo na tabela que geramos...
            if( termo_que_possui_essas_constantes != undefined )
            {       
                CONSTANTES_MULTIPLICANDO_OU_DIVIDINDO_TERMOS.push( dados_inserir );
                tabela_CONSTANTES_MULTIPLICANDO_OU_DIVIDINDO_TERMOS[termo_que_possui_essas_constantes] = dados_inserir;
            }
        }   

        //TODO: colocar de volta as contantes na expressao

        //cria uma tabela "ID_TERMO * ID_TERMO" : dados_derivacao_incluindo_constante
        //TODO: CORRIGIR, NO CASO DEVERIA SER CONSTANTES_INICIO * (DERIVADA_FORA * DERIVADA_DENTRO) * CONSTANTES_FINAL
        //Cria uma relação da derivacao e a constantes que ela tem, uma string contendo isso acima
        let tabela_termos_substituidos_com_constantes = {};
        let tabela_derivacoes_com_constantes_recolocadas = {};

        for( let p = 0 ; p < termos_substituidos_pelos_ids.length ; p++ )
        {
            let termo_com_id_derivacao_atual = termos_substituidos_pelos_ids[p];

            if( termo_com_id_derivacao_atual != 'constante' )
            {
                let termo_dividido_por_palavras = termo_com_id_derivacao_atual.split(' ');

                //Para cada ID_DERIVACAO encontrado dentro da expressão do termo atual
                for( let p1 = 0 ; p1 < termo_dividido_por_palavras.length ; p1++ )
                {
                    let id_derivacao_atual = termo_dividido_por_palavras[p1];

                    //Se não for um operador matemático
                    if( id_derivacao_atual != '' && id_derivacao_atual != '*' && id_derivacao_atual != '/' )
                    {
                        let dados_constantes_presentes_esta_derivacao = mapa_derivacoes_prontas[id_derivacao_atual];
                        let termo_original_derivacao                  = dados_constantes_presentes_esta_derivacao['original'];
                        let derivada_termo_atual                      = dados_constantes_presentes_esta_derivacao['derivacao'];

                        //Encontra as contantes do termo
                        let constantes_este_termo = null;
                        for( let p2 = 0 ; p2 < CONSTANTES_MULTIPLICANDO_OU_DIVIDINDO_TERMOS.length ; p2++ )
                        {
                            let dados_constantes = CONSTANTES_MULTIPLICANDO_OU_DIVIDINDO_TERMOS[p2];
                            let termo_atual_iteracao_p2 = dados_constantes['termo_sem_constantes'];

                            //Compara se é o termo em questão
                            if( utils.compareIgnoringSpaces(termo_original_derivacao, termo_atual_iteracao_p2) == true )
                            {
                                constantes_este_termo = dados_constantes;
                                break;
                            }
                        }

                        //Se o termo tem constante(SE ELA FOI ENCONTRADA)
                        if( constantes_este_termo )
                        {
                            let constantes_dentro_termo = constantes_este_termo['constantes_no_termo'];
                            let termo_original_este_termo = constantes_este_termo['termo_sem_constantes'];

                            //Ajuta as constantes que estão ANTES e DEPOIS do termo atual
                            let string_montada_termo_comeco = '';
                            let string_montada_termo_final = '';
                            let ultima_comeco_termo = {}; //a ultima constante posicionada no inicio do termo
                            constantes_dentro_termo.forEach(function(item_p1){
                                if( item_p1['posicao_termo'] == 'comeco_termo' ){
                                    string_montada_termo_comeco += String( (item_p1['caracter_atraz'] || '') ) + String(item_p1['constante'])
                                    ultima_comeco_termo = item_p1;

                                }else if( item_p1['posicao_termo'] == 'final_termo' ){
                                    string_montada_termo_final += String( (item_p1['caracter_atraz'] || '') ) + String(item_p1['constante'])
                                }
                            });

                            //Obtem qual a operação matemática que está na frente da ultima constante no inicio do termo
                            let operacao_mat_ultima_constante_inicio_termo = ultima_comeco_termo['tem_multiplicacao_logo_apos'] == true ? '*' : ultima_comeco_termo['tem_divisao_logo_apos'] == true ? '/' : '';

                            //Junta o termo com as constantes antes e depois dele
                            //let constantes_reestituida_termo = `${string_montada_termo_comeco} ${operacao_mat_ultima_constante_inicio_termo} ${termo_original_este_termo} ${string_montada_termo_final}`.trim();
                            //let constantes_reestituida_derivacao = `${string_montada_termo_comeco} ${operacao_mat_ultima_constante_inicio_termo} ${derivada_termo_atual} ${string_montada_termo_final}`.trim();
                            let constantes_reestituida_derivacao = `${string_montada_termo_comeco} ${operacao_mat_ultima_constante_inicio_termo} {CONTEUDO_DERIVACAO} ${string_montada_termo_final}`.trim();

                            tabela_derivacoes_com_constantes_recolocadas[ id_derivacao_atual ] = {
                                //Dados sobre o termo DONO dessa derivação cuja constantes foram restituidas
                                id_derivacao_pertencente             : id_derivacao_atual,

                                _owner: {
                                    termo                            : termo_original_derivacao,
                                    termo_sem_constantes             : termo_original_este_termo, 
                                    derivada_termo                   : derivada_termo_atual,
                                    id_derivacao_pertencente         : id_derivacao_atual,

                                    //Dados extras das derivações feitas nesse output
                                    _derivacao: {
                                        dados_derivacao : dados_constantes_presentes_esta_derivacao
                                    }
                                },

                                constantes_reestituida_derivacao   : constantes_reestituida_derivacao,
                                //constantes_reestituida_termo     : constantes_reestituida_termo,
                                //constantes_reestituida_derivacao : constantes_reestituida_derivacao,

                                //Dados extra das constantes usadas nesse output
                                _constantes: {
                                    constantes_dentro_termo     : constantes_dentro_termo,
                                    string_montada_termo_comeco : string_montada_termo_comeco,
                                    string_montada_termo_final  : string_montada_termo_final,
                                    ultima_comeco_termo         : ultima_comeco_termo
                                }
                            }
                        }

                    }
                }
            }

        }

        //TODO: substituir os IDs das derivações na expressão pelas derivadas que já calculamos

        //TODO: localizar as derivadas dependentes de cada derivada feita
        let tabela_derivacoes_depedentes = {
            //ex deriv1: [deriv2, deriv<N>, etc...]
        };

        //Para cada derivada feita
        for( let p = 0 ; p < lista_bruta_derivacoes_prontas.length ; p++ )
        {
            let info_derivacao_atual = lista_bruta_derivacoes_prontas[p];
            let id_derivacao_p       = info_derivacao_atual['id'];
            let derivacao_p          = info_derivacao_atual['derivacao'];
            let termo_p              = info_derivacao_atual['original'];
            let dependentes_p        = [];

            //Para cada derivada feita(segundo laço alinhado), VAI PROCURAR SE ELÁ(isso é a <P1>) DENTRO DA DERIVADA <P> do laço externo
            for( let p1 = 0 ; p1 < lista_bruta_derivacoes_prontas.length ; p1++ )
            {
                let info_derivacao_p1 = lista_bruta_derivacoes_prontas[p1];
                let id_derivacao_p1   = info_derivacao_p1['id'];
                let derivacao_p1      = info_derivacao_p1['derivacao'];
                let termo_p1          = info_derivacao_p1['original'];

                //Se foi encontrado exatamente a expressão(termo <termo_p1>), dentro da <derivacao_p>
                if( derivacao_p.indexOf( termo_p1 ) != -1 && 
                    termo_p1 != termo_p 
                ){
                    dependentes_p.push({
                        id: id_derivacao_p1,
                        termo: termo_p1,
                        derivacao: info_derivacao_p1['derivacao'],

                        //Dados extra
                        _dados: {
                            derivacao: info_derivacao_p1
                        }
                    });
                }

            }

            //Controi a relação, de quais são as derivadas dependentes de cada derivada feita
            tabela_derivacoes_depedentes[ id_derivacao_p ] = dependentes_p;
        }

        //TODO: monta termos_substituidos_pelos_ids, PORÈM COM AS DERIVADAS SUBSTITUIDAS NOVAMENTE
        let lista_termos_substituidos_pelos_ids_derivados = [];
        for( let p = 0 ; p < termos_substituidos_pelos_ids.length ; p++ )
        {
            let termo_atual_vai_substituir   = termos_substituidos_pelos_ids[p];
            let termo_derivacoes_p_juntadas  = String(termo_atual_vai_substituir);

            //Se nao for uma constante
            if( termo_atual_vai_substituir != 'constante' )
            {
                let derivacoes_divididas         = termo_atual_vai_substituir.split(' ');  //divide por palavras
                
                //Vai substituindo os IDs pelas suas respectivas derivações
                for( let p1 = 0 ; p1 < derivacoes_divididas.length ; p1++ )
                {   
                    let id_p1 = derivacoes_divididas[p1];

                    //Se não for uma operação matemática
                    if( id_p1 != '*' && id_p1 != '/' ) 
                    {
                        let dados_derivacao_p1 = mapa_derivacoes_prontas[ id_p1 ] || {};
                        let derivacao_p1       = dados_derivacao_p1['derivacao'];

                        termo_derivacoes_p_juntadas = utils.substituirTudo(String(termo_derivacoes_p_juntadas), id_p1, derivacao_p1);
                    }
                }

            }

            lista_termos_substituidos_pelos_ids_derivados.push( termo_derivacoes_p_juntadas );
        }

        debugger;

        //let termos = validacoes.get_derivacoes_identificadas( nivel_termos_identificados, emRelacao );

        //continuar da onde parou....

        //Critérios de parada extra
        if( iteracoes > 100 )
        {
            acabou = true;
            break;
        }
        iteracoes++;
    }
}