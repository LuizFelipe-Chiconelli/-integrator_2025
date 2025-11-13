'use client'

import type { NotificationProps } from "./types"

import { IoMdClose } from "react-icons/io"
import { FaCheckCircle } from "react-icons/fa"
import { IoMdCloseCircle } from "react-icons/io"

import { motion } from "framer-motion"

export default function Notification({ id, message, type = "Success", dismiss }: NotificationProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 200 }}
            exit={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white d-flex shadow-lg rounded-3"
            style={{
                width: '28rem',
                height: '5rem'
            }}
        >
            <div
                className="d-flex align-items-center justify-content-center"
                style={{ width: '8rem' }}
            >
                {type === "Success" ? (
                    <FaCheckCircle style={{
                        fontSize: '40px',
                        color: '#4ade80'
                    }} />
                ) : (
                    <IoMdCloseCircle style={{
                        fontSize: '40px',
                        color: '#f87171'
                    }} />
                )}
            </div>

            <div className="w-100 d-flex align-items-center">
                <span style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {message}
                </span>
            </div>

            <button
                onClick={() => { dismiss(id) }}
                className="h-100 d-flex align-items-center justify-content-center rounded-end-3"
                style={{
                    width: '6rem',
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}
            >
                <IoMdClose size={20} />
            </button>
        </motion.div>
    )
}