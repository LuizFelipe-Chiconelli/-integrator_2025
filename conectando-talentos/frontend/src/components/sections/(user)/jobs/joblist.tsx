"use client";

import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

import JobFilters from "@/components/user/jobs/filter";
import List from "@/components/user/jobs/list";
import PaginationButtons from "@/components/all/pagination";
import api from "@/services/api";

export default function JobList() {
  const [texto, setTexto] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [version, setVersion] = useState(0); // força recarregar a List após candidatura

  // sempre que mudar o filtro, volte para a página 1
  useEffect(() => {
    setPage(1);
  }, [texto]);

  // ação do botão "Candidatar-se" no card
  const handleApply = async (vagaId: number) => {
    try {
      const { data } = await api.post("/candidatura/aplicar", { vaga_id: vagaId });
      if (data?.status === 201 || data?.ok) {
        alert(`Candidatura enviada para a vaga #${vagaId}`);
        setVersion((v) => v + 1); // recarrega lista e marca botão como inscrito
      } else if (data?.status === 409) {
        alert("Você já se candidatou a esta vaga.");
        setVersion((v) => v + 1);
      } else if (data?.status === 401) {
        alert("Você precisa estar logado e ter um currículo vinculado.");
      } else {
        alert(data?.mensagem || "Não foi possível enviar sua candidatura.");
      }
    } catch (e) {
      console.error(e);
      alert("Falha ao se candidatar.");
    }
  };

  return (
    <Container fluid className="mt-3 p-0">
      <JobFilters
        value={{ texto }}
        onChange={(v) => {
          setTexto(v.texto);
          setPage(1);
        }}
      />

      <List
        key={version} // força refetch quando version muda
        searchText={texto}
        page={page}
        pageSize={6}
        onLoaded={(meta) => setTotalPages(meta.totalPages || 1)}
        onApply={handleApply}
      />

      <PaginationButtons
        className="mt-3"
        active={page}
        total={totalPages}
        onChange={setPage}
      />
    </Container>
  );
}
