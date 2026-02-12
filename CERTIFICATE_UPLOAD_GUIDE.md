# Certificate Management Guide

## How to Add Certificates

### Step 1: Upload Certificate Files

Place your certificate files (PDFs, JPEGs, PNGs) in the `client/public/certificates/` directory:

```
client/public/certificates/
├── aws-solutions-architect.pdf
├── google-cloud-architect.pdf  
├── docker-fundamentals.png
├── react-certification.jpg
└── ...
```

### Step 2: Create Markdown File

For each certificate, create a corresponding `.md` file in `content/certificates/`:

```
content/certificates/
├── index.md
├── aws-solutions-architect.md
├── google-cloud-architect.md
├── docker-fundamentals.md
└── react-certification.md
```

### Step 3: Add Frontmatter Metadata

Each certificate markdown file should have this frontmatter structure:

```markdown
---
id: 1                                    # Unique ID
title: "Certificate Title"               # Full certificate name
issuer: "Organization Name"              # Who issued it (AWS, Google, etc.)
dateLabel: "March 2024"                 # Human-readable date
year: "2024"                            # Year for filtering/sorting
fileUrl: "/certificates/filename.pdf"   # Path to file (starts with /certificates/)
credentialId: "CERT-12345"              # Optional: Credential/Badge ID
verificationUrl: "https://verify..."    # Optional: Link to verify certificate
sortOrder: 1                            # Optional: Display order
---

# Certificate Description

Optional markdown content about the certification...
```

### Example Certificate Entry

**File**: `content/certificates/aws-solutions-architect.md`

```markdown
---
id: 1
title: "AWS Certified Solutions Architect - Associate"
issuer: "Amazon Web Services"
dateLabel: "March 2024"
year: "2024"
fileUrl: "/certificates/aws-solutions-architect.pdf"
credentialId: "AWS-SAA-12345678"
verificationUrl: "https://www.credly.com/badges/your-badge-id"
sortOrder: 1
---

# AWS Solutions Architect Associate

This certification validates technical skills and experience in designing distributed applications and systems on the AWS platform.
```

### File Organization Tips

1. **Naming Convention**: Use kebab-case for files
   - `aws-solutions-architect.pdf`
   - `google-cloud-professional.pdf`

2. **File Types Supported**: 
   - PDFs: `.pdf`
   - Images: `.jpg`, `.jpeg`, `.png`, `.webp`

3. **File Sizes**: Keep files under 5MB for good performance

4. **File Paths**: Always start fileUrl with `/certificates/`

### Required vs Optional Fields

**Required:**
- `id` - Unique number
- `title` - Certificate name
- `issuer` - Who issued it
- `dateLabel` - When you got it
- `year` - Year (for filtering)
- `fileUrl` - Path to the certificate file

**Optional:**
- `credentialId` - Certificate/badge ID number
- `verificationUrl` - Link to verify on issuer's website  
- `sortOrder` - Custom display order (defaults to date)

### Workflow Summary

1. **Save certificate files** → `client/public/certificates/`
2. **Create markdown file** → `content/certificates/certificate-name.md`
3. **Add frontmatter** with metadata
4. **Commit to Git**: `git add . && git commit -m "Add: New certificate"`
5. **Server automatically loads** the new certificate

### Accessing Certificates

Once added, certificates will be available via:
- **API**: `http://localhost:3000/api/certificates`
- **Direct file access**: `http://localhost:3000/certificates/filename.pdf`
- **Frontend**: Displayed in certificates gallery

That's it! Your certificates are now managed through the GitHub CMS system with version control.