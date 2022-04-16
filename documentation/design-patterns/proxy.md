### Proxy

- A classe proxy define como o Objeto final devera ser acessado.
- Exemplo (https://refactoring.guru/pt-br/design-patterns/proxy)

> ## Contexto:

> A biblioteca fornece a nós com uma classe de download de vídeo. Contudo, ela é muito ineficiente. Se a aplicação cliente pedir o mesmo vídeo múltiplas vezes, a biblioteca apenas baixa de novo e de novo, ao invés de colocar ele em cache e reutilizar o primeiro arquivo de download.

> A classe proxy implementa a mesma interface que a classe baixadora original e delega-a todo o trabalho. Contudo, ela mantém um registro dos arquivos baixados e retorna o resultado em cache quando a aplicação pede o mesmo vídeo múltiplas vezes.

```
// A interface de um serviço remoto.
interface ThirdPartyYouTubeLib is
    method listVideos()
    method getVideoInfo(id)
    method downloadVideo(id)

// A implementação concreta de um serviço conector. Métodos
// dessa classe podem pedir informações do YouTube. A velocidade
// do pedido depende da conexão do usuário com a internet, bem
// como do YouTube. A aplicação irá ficar lenta se muitos
// pedidos forem feitos ao mesmo tempo, mesmo que todos peçam a
// mesma informação.
class ThirdPartyYouTubeClass implements ThirdPartyYouTubeLib is
    method listVideos() is
        // Envia um pedido API para o YouTube.

    method getVideoInfo(id) is
        // Obtém metadados sobre algum vídeo.

    method downloadVideo(id) is
        // Baixa um arquivo de vídeo do YouTube.

// Para salvar largura de banda, nós podemos colocar os
// resultados do pedido em cache e mantê-los por determinado
// tempo. Mas pode ser impossível colocar tal código diretamente
// na classe de serviço. Por exemplo, ele pode ter sido
// fornecido como parte de uma biblioteca de terceiros e/ou
// definida como `final`. É por isso que nós colocamos o código
// do cache em uma nova classe proxy que implementa a mesma
// interface que a classe de serviço. Ela delega ao objeto do
// serviço somente quando os pedidos reais foram enviados.
class CachedYouTubeClass implements ThirdPartyYouTubeLib is
    private field service: ThirdPartyYouTubeLib
    private field listCache, videoCache
    field needReset

    constructor CachedYouTubeClass(service: ThirdPartyYouTubeLib) is
        this.service = service

    method listVideos() is
        if (listCache == null || needReset)
            listCache = service.listVideos()
        return listCache

    method getVideoInfo(id) is
        if (videoCache == null || needReset)
            videoCache = service.getVideoInfo(id)
        return videoCache

    method downloadVideo(id) is
        if (!downloadExists(id) || needReset)
            service.downloadVideo(id)

// A classe GUI, que é usada para trabalhar diretamente com um
// objeto de serviço, permanece imutável desde que trabalhe com
// o objeto de serviço através de uma interface. Nós podemos
// passar um objeto proxy com segurança ao invés de um objeto
// real de serviço uma vez que ambos implementam a mesma
// interface.
class YouTubeManager is
    protected field service: ThirdPartyYouTubeLib

    constructor YouTubeManager(service: ThirdPartyYouTubeLib) is
        this.service = service

    method renderVideoPage(id) is
        info = service.getVideoInfo(id)
        // Renderiza a página do vídeo.

    method renderListPanel() is
        list = service.listVideos()
        // Renderiza a lista de miniaturas do vídeo.

    method reactOnUserInput() is
        renderVideoPage()
        renderListPanel()

// A aplicação pode configurar proxies de forma fácil e rápida.
class Application is
    method init() is
        aYouTubeService = new ThirdPartyYouTubeClass()
        aYouTubeProxy = new CachedYouTubeClass(aYouTubeService)
        manager = new YouTubeManager(aYouTubeProxy)
        manager.reactOnUserInput()
```
