const { app, BrowserWindow, shell } = require('electron');
const rpc = require("discord-rpc");
const client = new rpc.Client({ transport: 'ipc' });
let id = '1257498304753700865';
const domain = 'crisordemparanormal.com';
let patente
let atual_page
const startedAt = Date.now();
let controle
let controle2
const titulos = ["A Melhor Plataforma para Jogar Ordem","Mundano", "Recruta","Operador","Agente Especial","Agente de Elite","Parceiro", "Equipe"]
const pictureNames = ["cris","mundano2","recruta2","operador2","especial2","elite2","parceiro2","equipe2"]
const lugares = ["Em missão ","Estudando o Outro Lado","Preenchendo papelada"]


function getLocale(texto) {
    if (texto.includes("/ameaca")) {
        return 1;
    }

    if (texto.includes("/ameacas")) {
        return 1;
    }

    if (texto.includes("/homebrews")) {
        return 1;
    }

    if (texto.includes("/perfil")) {
        return 2;
    }

    return 0;

}

const createWindow = () => {
    const page = new BrowserWindow({
        width: 1200,
        height: 600,
        minWidth: 1080,
        minHeight: 600,
        icon: `${__dirname}/icon.png`,
        autoHideMenuBar: true,
    });

    // Função para logar a URL atual
    const logCurrentUrl = () => {
        const currentUrl = page.webContents.getURL();
        if (currentUrl.includes(domain)) {
            //é possivel coletar todo o conteudo da pagina

        setTimeout(() => {
        page.webContents.executeJavaScript(`document.documentElement.outerHTML`)
            .then(html => {
                const tierPictureRegex = /<img[^>]*class=["'].*?tier-picture.*?["'][^>]*src=["'](.*?)["'][^>]*>/;
                const match = html.match(tierPictureRegex);
                if (match && match[1]) {
                    patente = match[1];
                } else {
                    //console.log("Imagem não encontrada.");
                }
            })
            .catch(error => {
               // console.error('Erro ao executar JavaScript na página:', error);
            });
            atual_page = currentUrl
        },2500)
        }
        }
    

    page.webContents.setWindowOpenHandler((details) => {
        if (details.url.includes(domain)) {
            // Interceptar as Urls New Windows Internas para redicional como quer
            return { 
                action: 'allow',
                overrideBrowserWindowOptions: {
                    width: 500,
                    height: 700,
                    minHeight: 600,
                    minWidth: 500,
                    icon: `${__dirname}/icon.png`,
                    autoHideMenuBar: true,
                    alwaysOnTop: true,
                    
                }
             };
        } else {
            // Abre a URL no navegador padrão
            shell.openExternal(details.url);
            return { action: 'deny' }; // Impede que a URL seja aberta dentro do Electron
        }
        return { action: 'allow' };
    });
        
    page.webContents.on('did-navigate-in-page', (event, url, isMainFrame) => {
        logCurrentUrl(); // Loga a URL após navegação na mesma página
    });

    page.loadURL(`https://${domain}`);
};

app.whenReady().then(createWindow);

client.login({ clientId: id }).catch(console.error);

setInterval(() => {
    //console.log(atual_page);
    //console.log(patente);
    updatePresence(getPatente(patente), startedAt, lugares[getLocale(atual_page)], 'Equipe').then(() => {
        

    }).catch(error => {
        //console.error('Erro ao atualizar RPC', error);
    });
}, 60000);

function getPatente(texto) {
    switch (texto) {
        case "/img/equipe-no-text-banner.webp": return 7;
        case "/img/parceiro-no-text-banner.webp": return 6;
        case "/img/agente-de-elite-no-text-banner-icon.png": return 5;
        case "/img/agente-especial-no-text-banner-icon.png": return 4;
        case "/img/operador-no-text-banner-icon.png": return 3;
        case "/img/recruta-no-text-banner-icon.png": return 2;
        case "/img/mundano-no-text-banner-icon.png": return 1;
        default: return 0;
    } 
} 




client.on('ready', () => {
    //console.log('RPC Iniciado');
    setTimeout(() => {
        updatePresence(getPatente(patente), startedAt, 'Tá na Hora do Show!', 'Equipe').then(() => {
            
        })
    }, 7000);
})



async function updatePresence(tier, startedAt, details, state) {
//console.log("------------------")
//console.log(details)
//console.log(state)
//console.log(controle)
//console.log(controle2)
//console.log("------------------")
if (details == controle && state == controle2) {
    controle = details;
    controle2 = state;
    //console.log('RPC Mantem');
    return false;
} else {
    client.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: {
            details: details,
            timestamps: {
                start: startedAt ?? Date.now()
            },
            assets: {
                large_image: pictureNames[tier],
                large_text: titulos[tier],
                small_image: 'null',
                small_text: 'null',
            },
            buttons: [{
                    label: 'Juntar-se a Ordem',
                    url: 'https://crisordemparanormal.com/'
                }
            ]
        }
    
    }).then(() => {
        controle = details
        controle2 = state
        //console.log('RPC Atualizado');
    }
    )
    return true;
}
}