import Image from 'next/image'

interface TestimonialCardProps {
  name: string
  role: string
  photo: string
  content: string
  rating: number
  serviceUsed?: string
}

export default function TestimonialCard({ name, role, photo, content, rating, serviceUsed }: TestimonialCardProps) {
  return (
    <div className="flex-shrink-0 w-80 sm:w-96 p-6 rounded-2xl bg-surface border border-border shadow-soft hover:shadow-soft-lg transition-all duration-300 group">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-accent' : 'text-border'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-text-secondary text-sm leading-relaxed mb-5 line-clamp-4">
        &ldquo;{content}&rdquo;
      </p>

      {/* Author and Service */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
          <Image
            src={photo}
            alt={name}
            width={44}
            height={44}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-text-primary text-sm line-clamp-1">{name}</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-xs text-text-tertiary line-clamp-1">{role}</span>
            {serviceUsed && (
              <>
                <span className="hidden sm:inline text-border">•</span>
                <span className="text-xs font-medium text-primary mt-1 sm:mt-0 max-w-[120px] truncate" title={serviceUsed}>
                  {serviceUsed}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
