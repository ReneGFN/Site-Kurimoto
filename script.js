function enviarWhats(event) {
event.preventDefault();

const nome = document.getElementById('nome');
const mensagem = document.getElementById('mensagem');
const telefone = '5531999260299';
const texto = `Olá, meu nome é ${nome.value}, ${mensagem.value}`;
const msgFormatada = encodeURIComponent(texto);
const url = `https://wa.me/${telefone}?text=${msgFormatada}`;

window.open(url, '_blank');
}

// Dados dos álbuns de fotos
const albumsData = {
    1: {
        titulo: "Projeto 1 - Galeria",
        fotos: [
            {
                src: "imagens/projeto1.png",
                descricao: "Foto 1 do Projeto 1",
                localizacao: "Belo Horizonte, MG"
            },
            {
                src: "imagens/projeto1-foto2.jpg",
                descricao: "Foto 2 do Projeto 1",
                localizacao: "Belo Horizonte, MG"
            },
            {
                src: "imagens/projeto1-foto3.jpg",
                descricao: "Foto 3 do Projeto 1",
                localizacao: "Belo Horizonte, MG"
            },
            {
                src: "imagens/projeto1-foto4.jpg",
                descricao: "Foto 4 do Projeto 1",
                localizacao: "Belo Horizonte, MG"
            }
        ]
    },
    2: {
        titulo: "Projeto 2 - Galeria",
        fotos: [
            {
                src: "imagens/projeto2-foto1.jpg",
                descricao: "Foto 1 do Projeto 2",
                localizacao: "Rio de Janeiro, RJ"
            },
            {
                src: "imagens/projeto2-foto2.jpg",
                descricao: "Foto 2 do Projeto 2",
                localizacao: "Rio de Janeiro, RJ"
            },
            {
                src: "imagens/projeto2-foto3.jpg",
                descricao: "Foto 3 do Projeto 2",
                localizacao: "Rio de Janeiro, RJ"
            },
            {
                src: "imagens/projeto2-foto4.jpg",
                descricao: "Foto 4 do Projeto 2",
                localizacao: "Rio de Janeiro, RJ"
            }
        ]
    },
    3: {
        titulo: "Projeto 3 - Galeria",
        fotos: [
            {
                src: "imagens/projeto3-foto1.jpg",
                descricao: "Foto 1 do Projeto 3",
                localizacao: "São Paulo, SP"
            },
            {
                src: "imagens/projeto3-foto2.jpg",
                descricao: "Foto 2 do Projeto 3",
                localizacao: "São Paulo, SP"
            },
            {
                src: "imagens/projeto3-foto3.jpg",
                descricao: "Foto 3 do Projeto 3",
                localizacao: "São Paulo, SP"
            },
            {
                src: "imagens/projeto3-foto4.jpg",
                descricao: "Foto 4 do Projeto 3",
                localizacao: "São Paulo, SP"
            }
        ]
    }
};

const modal = document.getElementById('modal');
const fecharBtn = document.querySelector('.fechar');
const modalTitulo = document.getElementById('modal-titulo');
const galeriaFotos = document.getElementById('galeria-fotos');
const modalConteudo = document.querySelector('.modal-conteudo');

// Fechar modal ao clicar no X (fecha tudo)
fecharBtn.addEventListener('click', async () => {
    // Se houver lightbox aberto, fecha ele primeiro (aguarda animação)
    const lb = document.getElementById('lightbox');
    if (lb) await closeLightbox();
    // fecha o modal por completo
    modal.style.display = 'none';
});

// Ao clicar fora do conteúdo do modal
window.addEventListener('click', async (event) => {
    if (event.target === modal) {
        // se houver lightbox aberto, fecha ele; senão fecha o modal
        const lb = document.getElementById('lightbox');
        if (lb) {
            await closeLightbox();
            // reabrir galeria transparente se necessário (após remover lightbox)
            modal.style.display = 'flex';
            modal.classList.add('transparent');
            modalConteudo.classList.add('transparent');
        } else {
            modal.style.display = 'none';
        }
    }
});

// Adicionar evento aos cards de projetos
document.querySelectorAll('.projetos-card').forEach((card, index) => {
    card.addEventListener('click', () => {
        const projetoId = index + 1;
        const album = albumsData[projetoId];
        
        // Atualizar título
        modalTitulo.textContent = album.titulo;
        
        // Limpar galeria anterior
        galeriaFotos.innerHTML = '';
        
        // Adicionar fotos à galeria (estado inicial: modal transparente)
        album.fotos.forEach((foto, fotoIndex) => {
            const img = document.createElement('img');
            img.src = foto.src;
            img.alt = foto.descricao;
            img.className = 'foto-album';
            if (fotoIndex === 0) img.classList.add('ativa');

            // Clique na miniatura -> abre lightbox standalone
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                // fecha modal (mantém galeria para quando lightbox fechar)
                modal.style.display = 'none';
                openLightbox(foto);

                // Remover classe ativa de todas e marcar a clicada
                document.querySelectorAll('.foto-album').forEach(f => f.classList.remove('ativa'));
                img.classList.add('ativa');
            });

            galeriaFotos.appendChild(img);
        });

        // Abre o modal em modo transparente mostrando somente as miniaturas
        modal.style.display = 'flex';
        modal.classList.add('transparent');
        modal.classList.remove('expanded');
        modalConteudo.classList.add('transparent');
        // garante que a galeria esteja visível e que não exista vista expandida residual
        galeriaFotos.style.display = '';
        const prevExpanded = document.getElementById('expanded-view');
        if (prevExpanded) prevExpanded.remove();
    });
});

// Função para exibir detalhes da foto
function exibirFotoDetalhes(foto, index, album) {
    const descricaoFoto = document.getElementById('descricao-foto');
    const descricaoCompleta = document.getElementById('descricao-completa-text');

    // Atualiza o título curto e exibe a descrição completa (sem mapa)
    descricaoFoto.textContent = foto.descricao;
    descricaoCompleta.textContent = foto.descricao + "\nLocal: " + (foto.localizacao || 'Não informada');
}

// Abre um lightbox standalone (somente a imagem + descrição) com transição
async function openLightbox(foto) {
    // aguarda remoção de qualquer lightbox anterior
    await closeLightbox();

    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';

    const inner = document.createElement('div');
    inner.className = 'lightbox-inner';
    inner.setAttribute('role', 'dialog');
    inner.setAttribute('aria-modal', 'true');
    inner.addEventListener('click', (e) => e.stopPropagation());

    const img = document.createElement('img');
    img.src = foto.src;
    img.alt = foto.descricao;
    img.className = 'lightbox-img';

    const desc = document.createElement('div');
    desc.className = 'lightbox-desc';
    const h = document.createElement('h3');
    h.textContent = foto.descricao;
    const p = document.createElement('p');
    p.textContent = 'Local: ' + (foto.localizacao || 'Não informada');

    desc.appendChild(h);
    desc.appendChild(p);

    inner.appendChild(img);
    inner.appendChild(desc);
    lightbox.appendChild(inner);

    // fechar ao clicar fora (aguarda animação de fechamento antes de reabrir a galeria)
    lightbox.addEventListener('click', async () => {
        await closeLightbox();
        // quando fechar, reabre o modal transparente (galeria)
        modal.style.display = 'flex';
        modal.classList.add('transparent');
        modalConteudo.classList.add('transparent');
    });

    document.body.appendChild(lightbox);

    // forçar reflow para ativar animação CSS
    requestAnimationFrame(() => {
        lightbox.classList.add('visible');
        img.classList.add('visible');
        desc.classList.add('visible');
    });
}

// Fecha o lightbox e retorna uma Promise resolvida quando removido
function closeLightbox() {
    return new Promise((resolve) => {
        const existing = document.getElementById('lightbox');
        if (!existing) return resolve();
        // iniciar fechamento visual
        existing.classList.remove('visible');

        const onEnd = (e) => {
            // garantir que o listener seja limpo
            existing.removeEventListener('transitionend', onEnd);
            if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
            resolve();
        };

        existing.addEventListener('transitionend', onEnd);

        // fallback: se transitionend não ocorrer, removemos após 400ms
        setTimeout(() => {
            const el = document.getElementById('lightbox');
            if (el && el.parentNode) el.parentNode.removeChild(el);
            resolve();
        }, 400);
    });
}

// Menu toggle (mobile)
const menuToggleBtn = document.getElementById('menu-toggle');
const menuEl = document.querySelector('.menu');
if (menuToggleBtn && menuEl) {
    menuToggleBtn.addEventListener('click', () => {
        menuEl.classList.toggle('show');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            menuEl.classList.remove('show');
        });
    });
}

// Tecla ESC: fecha vista expandida ou o modal
window.addEventListener('keydown', async (e) => {
    if (e.key === 'Escape') {
        const lb = document.getElementById('lightbox');
        if (lb) {
            await closeLightbox();
            // reabrir modal transparente se desejar
            modal.style.display = 'flex';
            modal.classList.add('transparent');
            modalConteudo.classList.add('transparent');
        } else if (modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    }
});