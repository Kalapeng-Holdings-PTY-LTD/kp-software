import { vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import { AuthProvider } from './context/AuthContext'

vi.mock('./api/client', () => ({
  authApi: {
    me: vi.fn().mockRejectedValue(new Error('no session')),
    login: vi.fn(),
  },
  publicApi: {
    getServices: vi.fn().mockResolvedValue([
      { id: 'custom-fabrication', title: 'Custom Fabrication', description: 'Bespoke work.' },
    ]),
    getPortfolio: vi.fn().mockResolvedValue([]),
    getReviews: vi.fn().mockResolvedValue([
      { id: '1', authorName: 'Jane', rating: 5, title: 'Great', body: 'Excellent work.' },
    ]),
    submitEnquiry: vi.fn(),
  },
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('public site', () => {
    it('renders the home page hero', () => {
      renderAt('/')
      expect(
        screen.getByRole('heading', { name: /precision steel work/i })
      ).toBeInTheDocument()
    })

    it('renders primary navigation links', () => {
      renderAt('/')
      expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument()
    })

    it('renders the login page', () => {
      renderAt('/login')
      expect(screen.getByRole('heading', { name: /portal login/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    })

    it('renders the contact enquiry form', () => {
      renderAt('/contact')
      expect(screen.getByRole('heading', { name: /contact & quote request/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit enquiry/i })).toBeInTheDocument()
    })

    it('keeps submit enquiry disabled until policy consent is checked', async () => {
      const user = userEvent.setup()
      renderAt('/contact')
      const submit = screen.getByRole('button', { name: /submit enquiry/i })
      expect(submit).toBeDisabled()
      await user.click(screen.getByRole('checkbox'))
      expect(submit).toBeEnabled()
    })

    it('renders legal policy pages', () => {
      renderAt('/privacy')
      expect(screen.getByRole('heading', { name: /privacy policy/i })).toBeInTheDocument()
      renderAt('/terms')
      expect(screen.getByRole('heading', { name: /terms & conditions/i })).toBeInTheDocument()
    })
  })

  describe('branding', () => {
    it('shows KP Enterprise branding in the header', () => {
      renderAt('/')
      const brandLink = screen.getByRole('link', { name: /kp enterprise/i })
      expect(brandLink).toHaveAttribute('href', '/')
    })
  })
})
