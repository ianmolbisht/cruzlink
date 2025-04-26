"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Phone, User, Search, AlertCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileLayout } from "@/components/mobile-layout"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface Contact {
  id: string
  name: string
  phone: string
  isEmergency: boolean
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: "1", name: "John Smith", phone: "(555) 123-4567", isEmergency: true },
    { id: "2", name: "Sarah Johnson", phone: "(555) 987-6543", isEmergency: true },
    { id: "3", name: "Emergency Services", phone: "911", isEmergency: true },
    { id: "4", name: "Michael Brown", phone: "(555) 456-7890", isEmergency: false },
    { id: "5", name: "Emily Davis", phone: "(555) 234-5678", isEmergency: false },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const emergencyContacts = filteredContacts.filter((contact) => contact.isEmergency)
  const otherContacts = filteredContacts.filter((contact) => !contact.isEmergency)

  const toggleEmergencyContact = (id: string) => {
    setContacts(
      contacts.map((contact) => (contact.id === id ? { ...contact, isEmergency: !contact.isEmergency } : contact)),
    )
  }

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center p-4 border-b">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Emergency Contacts</h1>
        </div>

        <div className="p-4 flex-1">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                Emergency Contacts
              </h2>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add New
              </Button>
            </div>

            {emergencyContacts.length > 0 ? (
              <div className="space-y-2">
                {emergencyContacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{contact.name}</h3>
                            <p className="text-xs text-gray-500">{contact.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Phone className="h-4 w-4 text-green-600" />
                          </Button>
                          <Switch
                            checked={contact.isEmergency}
                            onCheckedChange={() => toggleEmergencyContact(contact.id)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">No emergency contacts found</div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-medium mb-2">Other Contacts</h2>
            {otherContacts.length > 0 ? (
              <div className="space-y-2">
                {otherContacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{contact.name}</h3>
                            <p className="text-xs text-gray-500">{contact.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Phone className="h-4 w-4 text-green-600" />
                          </Button>
                          <Switch
                            checked={contact.isEmergency}
                            onCheckedChange={() => toggleEmergencyContact(contact.id)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500">No contacts found</div>
            )}
          </div>
        </div>

        <div className="p-4 border-t">
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>
    </MobileLayout>
  )
}
