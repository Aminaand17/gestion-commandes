<?php
namespace App\Controller;

use App\Entity\Client;
use App\Entity\Article;
use App\Entity\Commande;
use Doctrine\Persistence\ManagerRegistry; 
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class CommandeController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    #[Route('/', name: 'nouvelle_commande')]
    public function nouvelleCommande(Request $request)
    {
        $articles = $this->doctrine->getRepository(Article::class)->findAll();
        $client = null;
        if ($telephone = $request->get('telephone')) {
            $client = $this->doctrine->getRepository(Client::class)->findOneBy(['telephone' => $telephone]);
        }
        if ($request->isMethod('POST')) {
            $clientId = $request->get('client_id');
            $client = $this->doctrine->getRepository(Client::class)->find($clientId);
            $commande = new Commande();
            $commande->setClientId($client);
            $commande->setDateCommande(new \DateTimeImmutable());
            $articlesIds = $request->get('articles', []);
            $selectedArticles = $this->doctrine->getRepository(Article::class)->findBy(['id' => $articlesIds]);
            $totalAmount = 0;

            foreach ($selectedArticles as $article) {
                $commande->addLigneCommande($article);
                $totalAmount += $article->getPrix();
            }
            $entityManager = $this->doctrine->getManager();
            $entityManager->persist($commande);
            $entityManager->flush();
            return $this->redirectToRoute('nouvelle_commande');
        }

        return $this->render('commande/nouvelle_commande.html.twig', [
            'client' => $client,
            'articles' => $articles,
        ]);
    }
}
