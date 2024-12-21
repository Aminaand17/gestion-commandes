<?php
namespace App\Controller;

use App\Entity\Client;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry; 

class ClientController extends AbstractController
{
    private $doctrine;
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }


    #[Route('/client-info/{telephone}', name: 'client_info', methods: ['GET'])]
    public function getClientInfo($telephone)
    {
        $client = $this->doctrine->getRepository(Client::class)->findOneBy(['telephone' => $telephone]);

        if ($client) {
            return new JsonResponse(['client' => [
                'surname' => $client->getNom(),
                'firstname' => $client->getPrenom(),
                'address' => $client->getAdresse(),
            ]]);
        }

        return new JsonResponse(['client' => null]);
    }
}
