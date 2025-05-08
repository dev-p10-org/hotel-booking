
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useHotelDateSelection } from "@/hooks/use-hotel-date-selection"
import { SelectDateLoading } from "@/components/skeleton-select-date"

export default function HotelSelectDatePage() {
  // Use our custom hook
  const {
    hotel,
    loading,
    error,
    checkInOpen,
    checkOutOpen,
    selectedDates,
    setCheckInOpen,
    setCheckOutOpen,
    handleDateSelectCheckIn,
    handleDateSelectCheckOut,
    handleContinue,
    formatDateIndonesian,
  } = useHotelDateSelection()

  if (loading) {
    return <SelectDateLoading />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm p-6">
          { error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">{error}</div>
          ) : (
            <>
              <h1 className="text-xl font-bold mb-6">Pilih tanggal check-in dan check-out</h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary-500" />
                </div>
                <span className="text-xl font-semibold">{hotel?.name || "Hotel Pesan.io"}</span>
              </div>

              <div className="space-y-6">
                {/* Check-in date */}
                <div>
                  <div className="text-gray-500 mb-2">Check-In</div>
                  <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center gap-3 py-3 border-b border-gray-200 focus:outline-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-lg font-medium">
                          {selectedDates.checkIn
                            ? formatDateIndonesian(selectedDates.checkIn)
                            : "Pilih tanggal check-in"}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDates.checkIn || undefined}
                        onSelect={handleDateSelectCheckIn}
                        disabled={(date) => {
                          const yesterday = new Date()
                          yesterday.setDate(yesterday.getDate() - 1)
                          return date < yesterday
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check-out date */}
                <div>
                  <div className="text-gray-500 mb-2">Check-Out</div>
                  <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                    <PopoverTrigger asChild>
                      <button className="w-full flex items-center gap-3 py-3 border-b border-gray-200 focus:outline-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-lg font-medium">
                          {selectedDates.checkOut
                            ? formatDateIndonesian(selectedDates.checkOut)
                            : "Pilih tanggal check-out"}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDates.checkOut || undefined}
                        onSelect={handleDateSelectCheckOut}
                        disabled={(date) => !selectedDates.checkIn || date <= selectedDates.checkIn}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Search button */}
                <Button
                  onClick={handleContinue}
                  disabled={!selectedDates.checkIn || !selectedDates.checkOut}
                  className="w-full py-6 text-lg bg-primary-500 hover:bg-primary-600 rounded-lg mt-6"
                >
                  Cari Kamar
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PesanBooking. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
