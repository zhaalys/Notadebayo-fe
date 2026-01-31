"use client";

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Calendar, CheckCircle2, Circle, Trash2, Edit } from "lucide-react"

interface Note {
  id: string
  title: string
  content: string
  priority: "low" | "medium" | "high" | "urgent"
  completed: boolean
  created_at: string
  updated_at: string
}

export default function Page() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium" as Note["priority"]
  })
  const router = useRouter()

  useEffect(() => {
    // Hanya berjalan di client-side
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    loadNotes()
  }, [router])

  const loadNotes = () => {
    // Hanya berjalan di client-side
    if (typeof window === 'undefined') return;
    
    const savedNotes = localStorage.getItem("notepad-notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
    setLoading(false)
  }

  const saveNotes = (updatedNotes: Note[]) => {
    // Hanya berjalan di client-side
    if (typeof window === 'undefined') return;
    
    localStorage.setItem("notepad-notes", JSON.stringify(updatedNotes))
    setNotes(updatedNotes)
  }

  const addNote = () => {
    if (!formData.title.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    saveNotes([newNote, ...notes])
    setFormData({ title: "", content: "", priority: "medium" })
    setShowAddForm(false)
  }

  const updateNote = () => {
    if (!editingNote || !formData.title.trim()) return

    const updatedNotes = notes.map(note =>
      note.id === editingNote.id
        ? {
            ...note,
            title: formData.title,
            content: formData.content,
            priority: formData.priority,
            updated_at: new Date().toISOString()
          }
        : note
    )

    saveNotes(updatedNotes)
    setEditingNote(null)
    setFormData({ title: "", content: "", priority: "medium" })
  }

  const deleteNote = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
      saveNotes(notes.filter(note => note.id !== id))
    }
  }

  const toggleComplete = (id: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, completed: !note.completed, updated_at: new Date().toISOString() }
        : note
    )
    saveNotes(updatedNotes)
  }

  const startEdit = (note: Note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      priority: note.priority
    })
    setShowAddForm(true)
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || note.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive"
      case "high": return "default"
      case "medium": return "secondary"
      case "low": return "outline"
      default: return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">Notadebayo</h1>
                <p className="text-sm text-gray-500">Digital Notepad</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-lg font-semibold text-black">{notes.length}</p>
                <p className="text-xs text-gray-500">Total Catatan</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-600">{notes.filter(n => n.completed).length}</p>
                <p className="text-xs text-gray-500">Selesai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pencarian dan Filter */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari catatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-4 bg-gray-100 border-0 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
            >
              <option value="all">Semua Prioritas</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <button 
              onClick={() => setShowAddForm(true)} 
              className="px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              + Tambah Catatan
            </button>
          </div>
        </div>

        {/* Form Tambah/Edit Catatan */}
        {showAddForm && (
          <div className="mb-8 bg-black rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                {editingNote ? <Edit className="h-4 w-4 text-black" /> : <Plus className="h-4 w-4 text-black" />}
              </div>
              <h2 className="text-xl font-bold text-white">
                {editingNote ? "Edit Catatan" : "Catatan Baru"}
              </h2>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Judul catatan..."
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border-0 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <textarea
                placeholder="Isi catatan..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border-0 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white resize-none"
              />
              <select 
                value={formData.priority} 
                onChange={(e) => setFormData({...formData, priority: e.target.value as Note["priority"]})}
                className="w-full px-4 py-3 bg-gray-800 border-0 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white cursor-pointer"
              >
                <option value="low">🟢 Prioritas Rendah</option>
                <option value="medium">🟡 Prioritas Sedang</option>
                <option value="high">🟠 Prioritas Tinggi</option>
                <option value="urgent">🔴 Prioritas Urgent</option>
              </select>
              <div className="flex gap-3">
                <button 
                  onClick={editingNote ? updateNote : addNote}
                  className="flex-1 py-3 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  {editingNote ? "Update Catatan" : "Simpan Catatan"}
                </button>
                <button 
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingNote(null)
                    setFormData({ title: "", content: "", priority: "medium" })
                  }}
                  className="flex-1 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Daftar Catatan */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-4 text-gray-500">Memuat catatan...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-3">Belum ada catatan</h3>
            <p className="text-gray-500 mb-6">Buat catatan pertama Anda untuk memulai</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              + Buat Catatan Pertama
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredNotes.map((note) => (
              <div 
                key={note.id} 
                className={`bg-black rounded-2xl p-6 transition-all duration-200 ${
                  note.completed ? 'opacity-60' : 'hover:shadow-xl'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleComplete(note.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {note.completed ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-600 rounded-full hover:border-white transition-colors"></div>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-lg mb-2 text-white ${note.completed ? 'line-through text-gray-500' : ''}`}>
                          {note.title}
                        </h3>
                        {note.content && (
                          <p className={`text-gray-300 mb-3 ${note.completed ? 'line-through' : ''}`}>
                            {note.content}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          note.priority === 'urgent' ? 'bg-red-500 text-white' :
                          note.priority === 'high' ? 'bg-orange-500 text-white' :
                          note.priority === 'medium' ? 'bg-yellow-500 text-white' :
                          'bg-green-500 text-white'
                        }`}>
                          {note.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {new Date(note.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(note)}
                          className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                        >
                          <Edit className="h-4 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
