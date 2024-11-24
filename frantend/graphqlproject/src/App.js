import React, { useState } from "react";
import "./App.css";
import { useMutation, useQuery } from '@apollo/client';
import { SAVECOMPTE, DELETE_COMPTE, COMPTE_BY_TYPE, GET_ALL_COMPTES, GET_TOTAL_SOLDE ,COMPTE_BY_ID,DEPOSIT, WITHDRAW } from './query';

function App() {
  const [solde, setSolde] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState(null); 
  const [compteId, setCompteId] = useState(null); 

  const { loading: allComptesLoading, error: allComptesError, data: allComptesData } = useQuery(GET_ALL_COMPTES);
  const { loading: soldeLoading, error: soldeError, data: soldeData } = useQuery(GET_TOTAL_SOLDE);
  const { loading: findByTypeLoading, error: findByTypeError, data: findByTypeData } = useQuery(COMPTE_BY_TYPE, {
    variables: { type: selectedType },
    skip: !selectedType,
  });

  const [saveCompte] = useMutation(SAVECOMPTE, {
    onCompleted: () => {
      alert('Compte ajouté avec succès!');
    },
    onError: (err) => {
      alert(`Erreur : ${err.message}`);
    },
    refetchQueries: [{ query: GET_ALL_COMPTES }, { query: GET_TOTAL_SOLDE }],
  });

  const [deleteCompte] = useMutation(DELETE_COMPTE, {
    onCompleted: () => {
      alert('Compte supprimé avec succès!');
    },
    onError: (err) => {
      alert(`Erreur : ${err.message}`);
    },
    refetchQueries: [{ query: GET_ALL_COMPTES }, { query: GET_TOTAL_SOLDE }],
  });
  const [deposit] = useMutation(DEPOSIT, {
    onCompleted: () => {
      alert('Dépôt effectué avec succès!');
      setIsModalOpen(false);
    },
    onError: (err) => {
      alert(`Erreur : ${err.message}`);
    },
    refetchQueries: [{ query: GET_ALL_COMPTES }, { query: GET_TOTAL_SOLDE }],
  });
  const [withdraw] = useMutation(WITHDRAW, {
    onCompleted: () => {
      alert('Retrait effectué avec succès!');
      setIsModalOpen(false);
    },
    onError: (err) => {
      alert(`Erreur : ${err.message}`);
    },
    refetchQueries: [{ query: GET_ALL_COMPTES }, { query: GET_TOTAL_SOLDE }],
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDate = date ? new Date(date).toISOString().split('T')[0] : '';
    saveCompte({
      variables: {
        solde: parseFloat(solde),
        type,
        date: formattedDate,
      },
    });
    setSolde('');
    setType('');
    setDate('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      deleteCompte({ variables: { id } });
    }
  };
  const handleTransaction = (compteId, type) => {
    console.log('Transaction ouverte pour', type, 'Compte ID:', compteId);  
    setCompteId(compteId); 
    setTransactionType(type);
    setIsModalOpen(true);  
  };
  
  const handleTransactionSubmit = () => {
    const montant = parseFloat(transactionAmount);
    console.log('Montant:', montant, 'Transaction:', transactionType);  
    if (transactionType === 'deposit') {
      deposit({ variables: { compteId, montant } });
    } else if (transactionType === 'withdraw') {
      withdraw({ variables: { compteId, montant } });
    }
    setTransactionAmount(''); 
  };
  

  if (allComptesLoading || findByTypeLoading || soldeLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (allComptesError || findByTypeError || soldeError) {
    return <div className="alert alert-danger">Erreur : {allComptesError?.message || findByTypeError?.message || soldeError?.message}</div>;
  }

  const comptesToDisplay = selectedType ? findByTypeData?.findByType || [] : allComptesData?.allComptes || [];

  return (
    <div className="App">
      <h1>Gestion des Comptes</h1>
      <div className="page-layout">
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <h2>Ajouter un compte</h2>
            <label>Solde</label>
            <input
              type="number"
              value={solde}
              onChange={(e) => setSolde(e.target.value)}
              placeholder="Entrez le solde"
            />
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Sélectionner</option>
              <option value="COURANT">Courant</option>
              <option value="EPARGNE">Épargne</option>
            </select>
            <label>Date de création</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit" className="add-btn">Ajouter</button>
          </form>
        </div>

        <div className="table-section">
          <div className="search-bar">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="">Tous les comptes</option>
              <option value="COURANT">Courant</option>
              <option value="EPARGNE">Épargne</option>
            </select>
          </div>
          <h2>Liste des Comptes</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Solde</th>
                <th>Type</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comptesToDisplay.map((compte) => (
                <tr key={compte.id}>
                  <td>{compte.id}</td>
                  <td>{compte.solde.toFixed(2)}</td>
                  <td>{compte.type}</td>
                  <td>{compte.dateCreation}</td>
                  <td>
                    
                  <button className="delete-btn bg-primary" onClick={() => handleTransaction(compte.id, 'deposit')}>Dépôt</button>
                    <button className="delete-btn bg-warning" onClick={() => handleTransaction(compte.id, 'withdraw')}>Retrait</button>
                    <button className="delete-btn" onClick={() => handleDelete(compte.id)}>
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="statistics-section">
            <h3>Statistiques Totales</h3>
            <div className="card-container">
              {soldeData?.totalSolde ? (
                <>
                  <div className="card bg-primary ">
                    <h4>Somme des Soldes</h4>
                    <p>{soldeData.totalSolde.sum.toFixed(2)} DH</p>
                  </div>
                  <div className="card bg-success">
                    <h4>Moyenne des Soldes</h4>
                    <p>{soldeData.totalSolde.average.toFixed(2)} DH</p>
                  </div>
                  <div className="card bg-warning">
                    <h4>Nombre de Comptes</h4>
                    <p>{soldeData.totalSolde.count}</p>
                  </div>
                </>
              ) : (
                <div className="card">
                  <p>Chargement des statistiques...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
  
  {isModalOpen && (
  <div className="modal">
    <h2>{transactionType === 'deposit' ? 'Dépôt' : 'Retrait'}</h2>
    <input
      type="number"
      value={transactionAmount}
      onChange={(e) => setTransactionAmount(e.target.value)}
      placeholder={`Montant à ${transactionType === 'deposit' ? 'déposer' : 'retirer'}`}
    />
    <button className="delete-btn bg-primary" onClick={handleTransactionSubmit}>Confirmer</button>
    <button className="delete-btn bg-warning" onClick={() => setIsModalOpen(false)}>Fermer</button>
  </div>
)}
</div>
);
}

export default App;
