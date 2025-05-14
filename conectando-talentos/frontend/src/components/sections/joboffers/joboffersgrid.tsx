import { Container } from "react-bootstrap"

import OfferCard from "../../joboffers/offercard"
import JobOffersFilter from "../../joboffers/filter"

import type { JobOffer } from "../../../types/job"

export default function JobOffersGrid() {
    const jobOfferList: JobOffer[] = [
        {
            imageURL: 'https://images.seeklogo.com/logo-png/9/1/nintendo-logo-png_seeklogo-99658.png',
            city: 'São Paulo',
            uf: 'SP',
            enterprise: {
                name: 'Nintendo',
            },
            role: {
                name: 'Desenvolvedor Frontend Jr.',
                salary: '1800',
                workhours: 'Tempo Integral'
            },
            skills: ['React', 'TypeScript', 'Next.js'],
            createdAt: new Date()
        },
        {
            imageURL: 'https://images.seeklogo.com/logo-png/9/1/nintendo-logo-png_seeklogo-99658.png',
            city: 'São Paulo',
            uf: 'SP',
            enterprise: {
                name: 'Nintendo',
            },
            role: {
                name: 'Desenvolvedor Frontend Jr.',
                salary: '1800',
                workhours: 'Tempo Integral'
            },
            skills: ['React', 'TypeScript', 'Next.js', 'Redux', 'Styled Components', 'TailwindCSS'],
            createdAt: new Date()
        },
        {
            imageURL: 'https://images.seeklogo.com/logo-png/9/1/nintendo-logo-png_seeklogo-99658.png',
            city: 'São Paulo',
            uf: 'SP',
            enterprise: {
                name: 'Nintendo',
            },
            role: {
                name: 'Desenvolvedor Frontend Jr.',
                salary: '1800',
                workhours: 'Tempo Integral'
            },
            skills: ['React', 'TypeScript', 'Next.js', 'Redux', 'Styled Components', 'TailwindCSS'],
            createdAt: new Date()
        },
        {
            imageURL: 'https://images.seeklogo.com/logo-png/9/1/nintendo-logo-png_seeklogo-99658.png',
            city: 'São Paulo',
            uf: 'SP',
            enterprise: {
                name: 'Nintendo',
            },
            role: {
                name: 'Desenvolvedor Frontend Jr.',
                salary: 'R$ 1800 - R$ 2400',
                workhours: 'Tempo Integral'
            },
            skills: ['React', 'TypeScript', 'Next.js'],
            createdAt: new Date()
        }
    ]

    return (
        <Container fluid="xl" className="row d-flex justify-content-center mt-5">
            <Container id="job-offerfilter" className="col-3">
                <JobOffersFilter />
            </Container>
            <Container id="featured-job-offers" className="col">
                <div className="d-flex flex-column">
                    <h2 className="fw-bold">Vagas disponíveis</h2>
                </div>

                <div className="row mt-2 row-gap-4">
                    {jobOfferList.map(jobOffer => {
                        return (
                            <div className="col-lg-4">
                                <OfferCard jobOffer={jobOffer} />
                            </div>
                        )
                    })}
                </div>
            </Container>
        </Container>
    )
}