import { gql } from '@apollo/client';


export const DELETE_COMPTE = gql`
  mutation deleteCompte($id: ID!) {
    deleteById(id: $id)
  }
`;
export const GET_ALL_COMPTES = gql`
  query allComptes {
    allComptes {
      id
      solde
      dateCreation
      type
    }
  }
`;
export const COMPTE_BY_TYPE = gql`
  query compteByType($type: TypeCompte) {
    findByType(type: $type) {
      id
      solde
      type
      dateCreation
    }
  }
`;
export const COMPTE_BY_ID = gql`
  query compteById($id: ID!) {
    compteById(id: $id) {
      id
      solde
      type
      dateCreation
    }
  }
`;

export const GET_TOTAL_SOLDE = gql`
  query sum {
    totalSolde {
      sum
      average
      count
    }
  }
`;
export const SAVECOMPTE = gql`
  mutation saveCompte($solde: Float, $type: TypeCompte,$date:String) {
    saveCompte(
      compte: {
        solde: $solde
        type: $type
        dateCreation: $date
      }
    ) {
      id
    }
  }
`;
export const DEPOSIT = gql`
  mutation deposit($compteId: ID!, $montant: Float!) {
    deposit(compteId: $compteId, montant: $montant) {
      id
      solde
    }
  }
`;

export const WITHDRAW = gql`
  mutation withdraw($compteId: ID!, $montant: Float!) {
    withdraw(compteId: $compteId, montant: $montant) {
      id
      solde
    }
  }
`;
  