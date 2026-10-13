$(document).ready(function() {

    // 1. Efeito de Rolagem Suave (Smooth Scroll) ao clicar no menu
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        var target = this.hash;
        var $target =$(target);

        $('html, body').animate({
            'scrollTop': $target.offset().top - 20
        }, 800, 'swing', function () {
            window.location.hash = target;
        });
    });

    // 2. Função de Fade-In e Scroll Spy
    function onScrollOptimized() {
        var windowHeight = $(window).height();
        var scrollPos = $(window).scrollTop();
        var documentHeight = $(document).height();

        // A. Animação de Surgimento (Fade-In)
        $('.fade-element').each(function() {
            var elementTop = $(this).offset().top;
            if (elementTop < scrollPos + windowHeight - 50) {
                $(this).animate({ 'opacity': 1 }, { duration: 800, queue: false });$(this).css('transform', 'translateY(0)');
            }
        });

        // B. Espião de Rolagem (Scroll Spy) - Marca o menu ativo
        $('nav ul li a').each(function () {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            
            if (refElement.length) {
                var refTop = refElement.offset().top - 100;
                var refBottom = refTop + refElement.outerHeight();

                if (scrollPos >= refTop && scrollPos < refBottom) {
                    $('nav ul li a').removeClass("active");
                    currLink.addClass("active");
                }
            }
        });

        // C. Caso especial: final da página
        if(scrollPos + windowHeight >= documentHeight - 10) {
            $('nav ul li a').removeClass("active");
            $('nav ul li a').last().addClass("active");
        }
    }

    $('.fade-element').css('transition', 'transform 0.8s ease-out');
    onScrollOptimized(); // Dispara ao carregar

    // 3. Otimização do Evento de Scroll
    var scrollTimeout;
    $(window).scroll(function() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(function() {
            onScrollOptimized();
        });
    });

    // ==========================================
    // 4. LÓGICA DO QUIZ DINÂMICO E ALEATÓRIO
    // ==========================================
    const questionBank = [
        { q: "Qual a melhor forma de resolver um conflito em um trabalho em grupo?", options: ["Ignorar o colega e fazer tudo sozinho", "Ouvir os diferentes pontos de vista e buscar um consenso", "Impor a sua ideia, pois é a melhor", "Reclamar com o professor sem tentar conversar antes"], answer: 1 },
        { q: "Ao receber um feedback negativo sobre seu comportamento, você deve:", options: ["Ficar irritado e se defender imediatamente", "Ignorar, pois ninguém é perfeito", "Ouvir com atenção, refletir e tentar melhorar", "Apontar os defeitos da pessoa que está falando"], answer: 2 },
        { q: "O que caracteriza uma boa 'Soft Skill' de comunicação?", options: ["Falar difícil usando termos técnicos", "Falar sem parar para mostrar conhecimento", "Saber se expressar claramente e também saber ouvir (escuta ativa)", "Nunca discordar de ninguém"], answer: 2 },
        { q: "Se você chega atrasado em uma aula ou reunião, a postura correta é:", options: ["Entrar em silêncio, sentar e se inteirar do assunto sem atrapalhar", "Cumprimentar todo mundo em voz alta", "Ficar na porta esperando o professor parar a aula", "Inventar uma desculpa dramática para justificar"], answer: 0 },
        { q: "Interromper constantemente um colega enquanto ele fala demonstra:", options: ["Proatividade e inteligência", "Falta de respeito e ansiedade", "Liderança nata", "Empatia e colaboração"], answer: 1 },
        { q: "O que significa 'Autonomia' no contexto escolar e profissional?", options: ["Fazer apenas o que é mandado", "Tomar decisões responsáveis e agir sem precisar de cobrança", "Fazer o que quiser, na hora que quiser", "Transferir as responsabilidades para os outros"], answer: 1 },
        { q: "Deixar lixo na sua mesa após o término da aula indica falta de:", options: ["Comunicação", "Ética", "Responsabilidade e cuidado com o espaço coletivo", "Liderança"], answer: 2 },
        { q: "Fazer a sua parte num trabalho em equipe apenas no último minuto:", options: ["Gera estresse no grupo e demonstra falta de comprometimento", "É a melhor estratégia de produtividade", "Mostra que você trabalha bem sob pressão", "Não afeta os colegas, desde que seja entregue"], answer: 0 },
        { q: "Se você comete um erro num projeto da escola, qual a atitude mais profissional?", options: ["Esconder o erro e torcer para não verem", "Culpar outro membro do grupo", "Assumir o erro, pedir desculpas e buscar uma solução", "Abandonar o projeto"], answer: 2 },
        { q: "Empatia no ambiente escolar significa:", options: ["Ter pena dos colegas que tiram notas baixas", "Conseguir entender os sentimentos e perspectivas dos outros", "Ajudar apenas os seus amigos próximos", "Sempre concordar com a maioria"], answer: 1 },
        { q: "Uma postura NÃO profissional em áreas comuns (corredores) seria:", options: ["Andar em silêncio", "Cumprimentar os funcionários", "Gritar e correr enquanto outros estudam", "Jogar lixo na lixeira"], answer: 2 },
        { q: "Ética significa fazer o certo:", options: ["Apenas quando o professor está olhando", "Quando você ganha algo em troca", "Mesmo quando ninguém está vendo", "Só quando é regra escrita"], answer: 2 },
        { q: "Qual a importância de cuidar do patrimônio da escola?", options: ["Garantir que a escola não gaste dinheiro", "Demonstrar maturidade e preservar o ambiente que também será útil no futuro", "Apenas para não levar advertência", "Nenhuma, a escola é obrigada a consertar"], answer: 1 },
        { q: "Num debate em sala, discordar de uma ideia de forma profissional significa:", options: ["Atacar pessoalmente quem deu a ideia", "Falar alto para mostrar confiança", "Apresentar argumentos lógicos sem ofender o colega", "Ficar calado para evitar confusão"], answer: 2 },
        { q: "Ajudar a manter o ambiente organizado transmite qual imagem para um recrutador?", options: ["De alguém que não tem o que fazer", "De uma pessoa colaborativa e responsável", "De alguém mandão", "De uma pessoa individualista"], answer: 1 },
        { q: "O que NÃO é considerado uma Soft Skill?", options: ["Trabalho em equipe", "Inteligência emocional", "Digitar rápido no computador", "Resiliência"], answer: 2 },
        { q: "Como lidar com regras que você não concorda no ambiente escolar?", options: ["Desobedecer escondido", "Criar um conflito e gritar nos corredores", "Cumprir as regras, mas usar os canais adequados para questioná-las", "Faltar as aulas"], answer: 2 },
        { q: "Ter inteligência emocional na escola significa:", options: ["Nunca chorar ou ficar triste", "Saber reconhecer e lidar com as próprias emoções e as dos outros", "Manipular os colegas", "Ser sempre frio e calculista"], answer: 1 },
        { q: "Se o equipamento da sala quebrar na sua mão, você deve:", options: ["Colocar no lugar e sair de fininho", "Avisar o responsável imediatamente para que seja consertado", "Jogar a culpa no colega do lado", "Tentar consertar sozinho e piorar a situação"], answer: 1 },
        { q: "O que a sua postura de hoje diz sobre o profissional de amanhã?", options: ["Nada, na hora do emprego eu mudo", "Que pequenos hábitos constroem grandes profissionais", "Que a escola não serve para o mercado", "Que só notas importam"], answer: 1 }
    ];

    let currentQuiz = [];
    let currentQuestionIndex = 0;
    let score = 0;

    function shuffleArray(array) {
        let shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function startQuiz(numQuestions) {
        currentQuiz = shuffleArray(questionBank).slice(0, numQuestions);
        currentQuestionIndex = 0;
        score = 0;
        
        $('#quiz-setup').hide();
        $('#quiz-result').hide();
        $('#quiz-container').fadeIn();
        
        loadQuestion();
    }

    function loadQuestion() {
        $('#next-btn').hide();
        let qData = currentQuiz[currentQuestionIndex];
        
        $('#quiz-progress').text(`Pergunta ${currentQuestionIndex + 1} de ${currentQuiz.length}`);
        $('#question-text').text(qData.q);
        
        $('#options-container').empty();
        
        qData.options.forEach((opt, index) => {
            let btn = $(`<button class="option-btn">${opt}</button>`);
            btn.on('click', function() { checkAnswer(index, $(this)); });$('#options-container').append(btn);
        });
    }

    function checkAnswer(selectedIndex, btnElement) {
        let qData = currentQuiz[currentQuestionIndex];
        let correctIndex = qData.answer;

        $('.option-btn').attr('disabled', true); 

        if (selectedIndex === correctIndex) {
            btnElement.addClass('correct');
            score++;
        } else {
            btnElement.addClass('wrong');
            $('.option-btn').eq(correctIndex).addClass('correct');
        }
        $('#next-btn').fadeIn();
    }

    $('#next-btn').on('click', function() {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuiz.length) {
            loadQuestion();
        } else {
            showResult();
        }
    });

    function showResult() {
        $('#quiz-container').hide();
        $('#quiz-result').fadeIn();
        $('#score-text').text(`Você acertou ${score} de ${currentQuiz.length}!`);
        
        let percentage = score / currentQuiz.length;
        let msg = "";
        
        if(percentage === 1) msg = "Incrível! Você já tem a postura de um CEO!";
        else if(percentage >= 0.7) msg = "Muito bem! Você está no caminho certo para o sucesso.";
        else if(percentage >= 0.4) msg = "Bom esforço. Continue prestando atenção nas suas atitudes!";
        else msg = "Que tal revisar a página? Há sempre espaço para evoluir profissionalmente.";
        
        $('#score-message').text(msg);
    }

    $('#btn-5').on('click', () => startQuiz(5));
    $('#btn-10').on('click', () => startQuiz(10));
    $('#btn-15').on('click', () => startQuiz(15));
    $('#reset-btn').on('click', function() {
        $('#quiz-result').hide();
        $('#quiz-setup').fadeIn();
    });

});