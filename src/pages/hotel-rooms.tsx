import { useNavigate, useSearchParams } from 'react-router-dom'
import { NavigationMenu } from "@/components/navigation-menu"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  MapPin,
  Wifi,
  Coffee,
  Utensils,
  Car,
  FishIcon as Swimming,
  Dumbbell,
  Users,
  Check,
  ChevronDown,
  Bell,
  Building2,
  X,
} from "lucide-react"
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getCleanImageUrl, getRoomImageUrl } from "@/components/image-utils"
import { CollapsibleServiceDetails } from "@/components/collapsible-service-details"
import { useHotelRooms, formatIDR } from "@/hooks/use-hotel-rooms"
import { HotelRoomsLoading } from '@/components/skeleton-hotel-rooms'

// Helper function to get amenity icon
const getAmenityIcon = (amenity: string) => {
  const icons = {
    "Swimming pool": <Swimming className="h-5 w-5" />,
    Restaurant: <Utensils className="h-5 w-5" />,
    "Room service": <Coffee className="h-5 w-5" />,
    "Car park": <Car className="h-5 w-5" />,
    "Wi-Fi": <Wifi className="h-5 w-5" />,
    "Air conditioning": <Wifi className="h-5 w-5" />,
    "Fitness center": <Dumbbell className="h-5 w-5" />,
  }

  return icons[amenity as keyof typeof icons] || <Check className="h-5 w-5" />
}

// Function to render star rating
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-4 h-4">
          <Star
            className={`w-4 h-4 ${i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-gray-300 fill-gray-300"}`}
          />
        </div>
      ))}
    </div>
  )
}

export default function HotelDetailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Use the custom hook to manage hotel rooms logic
  const {
    hotel,
    showFullDescription,
    activeImageIndex,
    selectedRoomId,
    facilityCategories,
    selectedRatePlan,
    expandedCategories,
    selectedRoomsState,
    nights,
    handleRoomSelect,
    handleRatePlanSelect,
    handleQuantityChange,
    handleToggleCategory,
    handleToggleDescription,
    handleImageNavigation,
    saveBookingData,
    setActiveImageIndex,
  } = useHotelRooms(searchParams)

  const handleBookNow = () => {
    if (saveBookingData()) {
      navigate(`/booking`)
    }
  }

  if (!hotel) {
    return <HotelRoomsLoading />
  }

  const getTotalSelectedQuantityForRoom = (roomId: string) => {
    return Object.entries(selectedRoomsState)
      .filter(([key]) => key.startsWith(`${roomId}-`))
      .reduce((total, [_, selection]) => total + selection.quantity, 0)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationMenu />
      <main className="flex-1 bg-gray-50">
        {/* Image Gallery Slider */}
        <div className="w-full h-[300px] md:h-[400px] relative overflow-hidden">
          {/* Main Image */}
          <div className="relative w-full h-full">
            <div className="relative w-full h-full">
              <img
                src={
                  (hotel.hotelImageUrls || hotel.images || [])[activeImageIndex] ||
                  getCleanImageUrl(hotel.hotelName || hotel.name, 600, 600) ||
                  '/placeholder.svg'
                }
                alt={`${hotel.hotelName || hotel.name} - Image ${activeImageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              handleImageNavigation("prev")
            }}
          >
            <ChevronDown className="h-6 w-6 rotate-90" />
          </button>

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              handleImageNavigation("next")
            }}
          >
            <ChevronDown className="h-6 w-6 -rotate-90" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {activeImageIndex + 1} / {hotel.hotelImageUrls?.length || hotel.images?.length || 0}
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {(hotel.hotelImageUrls || hotel.images || []).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === activeImageIndex ? "bg-white" : "bg-white/50"}`}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Hotel Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs font-normal">
                    Family friendly
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">{hotel.hotelName || hotel.name}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={hotel.hotelRating || hotel.stars || 0} />
                  <span className="text-lg font-semibold">{hotel.hotelRating || hotel.rating || 0}/5</span>
                  <Button variant="link" className="text-sm p-0 h-auto">
                    See reviews ({hotel.reviews || 0})
                  </Button>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hotel.hotelLocation || hotel.address}</span>
                  <Button variant="link" className="text-sm p-0 h-auto ml-2">
                    See on the map
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-muted-foreground">
                  {showFullDescription
                    ? hotel.fullDescription || hotel.roomDescription || hotel.description
                    : hotel.description || hotel.roomDescription || ""}
                </p>
                {(hotel.fullDescription || hotel.description) && (
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2 flex items-center"
                    onClick={handleToggleDescription}
                  >
                    {showFullDescription ? "Show less" : "See description"}
                    <ChevronDown className={`h-4 w-4 ml-1 ${showFullDescription ? "rotate-180" : ""}`} />
                  </Button>
                )}
              </div>

              {/* Services & Equipments */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Fasilitas</h2>
                  <Button
                    variant="link"
                    className="text-primary-500 p-0 h-auto"
                    onClick={() => {
                      if (expandedCategories.length > 0) {
                        // Clear all expanded categories by toggling each one that is currently expanded
                        ;[...expandedCategories].forEach((categoryName) => handleToggleCategory(categoryName))
                      } else {
                        // Expand all categories
                        facilityCategories.forEach((c) => handleToggleCategory(c.facilityCategoryName))
                      }
                    }}
                  >
                    {expandedCategories.length > 0 ? "Lihat Lebih Ringkas" : "Lihat Semua Fasilitas"}
                  </Button>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-6">
                  {facilityCategories.map((category, index) => {
                    // Map icon string to actual icon component
                    let iconComponent
                    switch (category.icon) {
                      case "Bell":
                        iconComponent = <Bell className="w-6 h-6" />
                        break
                      case "Swimming":
                        iconComponent = <Swimming className="w-6 h-6" />
                        break
                      case "Car":
                        iconComponent = <Car className="w-6 h-6" />
                        break
                      case "Utensils":
                        iconComponent = <Utensils className="w-6 h-6" />
                        break
                      case "Building2":
                        iconComponent = <Building2 className="w-6 h-6" />
                        break
                      default:
                        iconComponent = <Check className="w-6 h-6" />
                    }

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleToggleCategory(category.facilityCategoryName)}
                      >
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mb-2">
                          {category.facilityCategoryImageUrl ? (
                            <img
                              src={category.facilityCategoryImageUrl || "/placeholder.svg"}
                              alt={category.facilityCategoryName}
                              width={24}
                              height={24}
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            iconComponent
                          )}
                        </div>
                        <span className="text-sm">{category.facilityCategoryName}</span>
                      </div>
                    )
                  })}
                </div>

                {expandedCategories.length > 0 ? (
                  <div className="space-y-1">
                    {facilityCategories
                      .filter((category) => expandedCategories.includes(category.facilityCategoryName))
                      .map((category, index) => (
                        <CollapsibleServiceDetails
                          key={index}
                          category={{
                            name: category.facilityCategoryName,
                            imageUrl: category.facilityCategoryImageUrl,
                            icon:
                              category.icon === "Bell" ? (
                                <Bell className="w-6 h-6" />
                              ) : category.icon === "Swimming" ? (
                                <Swimming className="w-6 h-6" />
                              ) : category.icon === "Car" ? (
                                <Car className="w-6 h-6" />
                              ) : category.icon === "Utensils" ? (
                                <Utensils className="w-6 h-6" />
                              ) : category.icon === "Building2" ? (
                                <Building2 className="w-6 h-6" />
                              ) : (
                                <Check className="w-6 h-6" />
                              ),
                          }}
                          services={category.services || []}
                          isExpanded={true}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Klik tombol "Lihat Semua Fasilitas" untuk melihat detail fasilitas hotel.
                    </p>
                  </div>
                )}
              </div>

              {/* Choose your room */}
              <div>
                <h2 className="text-xl font-bold mb-4">Choose your room</h2>

                <div className="space-y-4">
                  {(hotel.rooms || [])
                    .filter((room: any) => room.ratePlans && room.ratePlans.length > 0)
                    .map((room: any) => {
                      // Check if this room has any selected rate plans with quantity > 0
                      const hasSelectedQuantity = room.ratePlans.some(
                        (plan: any) => selectedRoomsState[`${room.roomId || room.id}-${plan.code}`]?.quantity > 0,
                      )

                      return (
                        <Card
                          key={room.roomId || room.id}
                          className={`overflow-hidden ${
                            selectedRoomId === (room.roomId || room.id)
                              ? "ring-2 ring-primary"
                              : hasSelectedQuantity
                                ? "ring-2 ring-primary-500"
                                : ""
                          }`}
                        >
                          <div className="relative h-48 w-full">
                            <div className="w-full h-full">
                              <img
                                src={
                                  room.images?.[0] ||
                                  getRoomImageUrl(room.image || room.roomName, 400, 600) ||
                                  '/placeholder.svg'
                                }
                                alt={room.roomName || room.name}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            </div>

                            {hasSelectedQuantity && (
                              <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                {room.ratePlans.reduce((total: number, plan: any) => {
                                  const key = `${room.roomId || room.id}-${plan.code}`
                                  return total + (selectedRoomsState[key]?.quantity || 0)
                                }, 0)}
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start mb-1">
                                  <h3 className="text-xl font-bold">{room.roomName || room.name}</h3>
                                  <Badge variant="outline" className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {room.maxGuest || room.capacity} Guests
                                  </Badge>
                                </div>
                                <div
                                  className="mb-2 text-base"
                                  dangerouslySetInnerHTML={{ __html: room.roomDescription || room.description || "" }}
                                />
                                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                                  <div>Room Size: {room.size || "Standard"}</div>
                                  <div>Bed: {room.beds || (room.maxGuest > 1 ? "Double Bed" : "Single Bed")}</div>
                                </div>
                                {room.roomFacilities && room.roomFacilities.length > 0 && (
                                  <div className="mb-2">
                                    <p className="font-medium mb-2">Room Facilities:</p>
                                    <div className="flex flex-wrap gap-2">
                                      {room.roomFacilities.slice(0, 5).map((facility: string, idx: number) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {facility}
                                        </Badge>
                                      ))}
                                      {room.roomFacilities.length > 5 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{room.roomFacilities.length - 5} more
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Add this helper function before the Rate Plans Section */}
                              {/* Rate Plans Section */}

                              <div className="mt-4 space-y-4">
                                {room.ratePlans && room.ratePlans.length > 0 ? (
                                  <>
                                    {/* Show available room quantity information */}
                                    <div className="text-sm text-gray-500 mb-2">
                                      <span className="font-medium">Kamar tersedia: </span>
                                      <span className={`${room.qty <= 1 ? "text-amber-600 font-medium" : ""}`}>
                                        {room.qty} {room.qty > 1 ? "kamar" : "kamar"}
                                      </span>
                                      {getTotalSelectedQuantityForRoom(room.roomId || room.id) > 0 && (
                                        <span className="ml-2">
                                          (Dipilih: {getTotalSelectedQuantityForRoom(room.roomId || room.id)})
                                        </span>
                                      )}
                                    </div>

                                    {room.ratePlans.map((plan: any, planIndex: number) => {
                                      // Calculate total quantity selected for this room across all rate plans
                                      const totalSelectedForRoom = getTotalSelectedQuantityForRoom(
                                        room.roomId || room.id,
                                      )
                                      // Calculate remaining quantity available for this room
                                      const remainingQuantity = (room.qty || 0) - totalSelectedForRoom
                                      // Get current quantity for this specific rate plan
                                      const currentPlanQuantity =
                                        selectedRoomsState[`${room.roomId || room.id}-${plan.code}`]?.quantity || 0

                                      // Determine if this plan is already selected
                                      const isPlanSelected = currentPlanQuantity > 0

                                      return (
                                        <div
                                          key={planIndex}
                                          className={`p-3 rounded-lg border ${
                                            selectedRoomId === (room.roomId || room.id) &&
                                            selectedRatePlan === plan.code
                                              ? "bg-primary/5 border-primary"
                                              : isPlanSelected
                                                ? "bg-primary-50 border-primary-200"
                                                : "bg-gray-50 border-gray-100"
                                          }`}
                                        >
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <h4 className="font-medium">
                                                {plan.name || `${room.roomName} Plan ${planIndex + 1}`}
                                              </h4>
                                              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                                                {plan.breakfast ? (
                                                  <div className="text-primary-600 flex items-center">
                                                    <Check className="h-3 w-3 mr-1" /> Termasuk Sarapan
                                                  </div>
                                                ) : (
                                                  <div className="text-gray-500 flex items-center">
                                                    <X className="h-3 w-3 mr-1" /> Tidak Termasuk Sarapan
                                                  </div>
                                                )}
                                                <span className="hidden sm:inline-block text-gray-300">|</span>
                                                <div className="flex items-center">
                                                  <Users className="h-3 w-3 mr-1" />
                                                  <span>{room.maxGuest || 2} Tamu</span>
                                                </div>
                                              </div>
                                              {plan.description && (
                                                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="text-lg font-bold">{formatIDR(plan.price)}</div>
                                              <div className="text-xs text-muted-foreground">
                                                /kamar ({room.night || 1} Malam)
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex justify-end mt-3">
                                            {isPlanSelected ? (
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  onClick={() =>
                                                    handleQuantityChange(room.roomId || room.id, plan.code, -1)
                                                  }
                                                >
                                                  -
                                                </Button>
                                                <span className="w-8 text-center font-medium">
                                                  {currentPlanQuantity}
                                                </span>
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="h-8 w-8 p-0"
                                                  onClick={() =>
                                                    handleQuantityChange(room.roomId || room.id, plan.code, 1)
                                                  }
                                                  disabled={remainingQuantity <= 0}
                                                >
                                                  +
                                                </Button>
                                              </div>
                                            ) : (
                                              <Button
                                                size="sm"
                                                variant={remainingQuantity > 0 ? "outline" : "ghost"}
                                                onClick={() => handleRatePlanSelect(room.roomId || room.id, plan.code)}
                                                disabled={remainingQuantity <= 0}
                                                className={
                                                  remainingQuantity <= 0 ? "text-gray-400 cursor-not-allowed" : ""
                                                }
                                              >
                                                {remainingQuantity > 0 ? "Select" : "Tidak Tersedia"}
                                              </Button>
                                            )}
                                          </div>
                                          {remainingQuantity <= 0 && !isPlanSelected && (
                                            <p className="text-xs text-amber-600 mt-2 text-right">
                                              Batas maksimum kamar tersedia telah dipilih
                                            </p>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </>
                                ) : (
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="mb-4 sm:mb-0">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div>
                                              <span className="text-2xl font-bold">{formatIDR(room.price)}</span>
                                              <span className="text-muted-foreground"> ({room.night} malam)</span>
                                            </div>
                                          </TooltipTrigger>
                                        </Tooltip>
                                      </TooltipProvider>
                                      {room.breakfastInclude && (
                                        <div className="text-sm text-primary-600 flex items-center mt-1">
                                          <Check className="h-3 w-3 mr-1" /> Breakfast included
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Floating Checkout Button */}
        {Object.keys(selectedRoomsState).length > 0 && (
          <div className="fixed bottom-0 max-w-[440px] w-[calc(100%-32px)] mx-auto bg-white border-t shadow-lg p-4 z-50 flex items-center justify-between left-1/2 transform -translate-x-1/2 mb-4 rounded-lg">
            <div>
              <div className="font-bold">
                {Object.values(selectedRoomsState).reduce((total, selection) => total + selection.quantity, 0)} Kamar
              </div>
              <div className="text-lg font-bold text-primary-600">
                {formatIDR(
                  Object.entries(selectedRoomsState).reduce((total, [key, selection]) => {
                    const [roomId, ratePlanCode] = key.split("-")
                    const room = hotel.rooms.find((r: any) => r.roomId === roomId || r.id === roomId)
                    if (!room) return total

                    const plan = room.ratePlans?.find((p: any) => p.code === ratePlanCode)
                    const price = plan ? plan.price : room.price

                    return total + price * nights * selection.quantity
                  }, 0),
                )}
              </div>
            </div>
            <Button
              onClick={handleBookNow}
              size="lg"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8"
              disabled={Object.keys(selectedRoomsState).length === 0}
            >
              PESAN
            </Button>
          </div>
        )}
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PesanBooking. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
