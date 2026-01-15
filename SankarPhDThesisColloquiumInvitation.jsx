import React, { useRef, useState } from 'react';

const ThesisInvitation = () => {
  const invitationRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Wait for fonts to load before capturing
  const waitForFonts = async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    
    // Force font loading with various weights and sizes used in the component
    const fontsToCheck = [
      { family: 'Cormorant Garamond', weights: [400, 500, 600], sizes: [13, 16, 17, 26, 28] },
      { family: 'Outfit', weights: [300, 400, 500, 600, 700], sizes: [10, 11, 12, 13, 15, 18] }
    ];
    
    for (const font of fontsToCheck) {
      for (const weight of font.weights) {
        for (const size of font.sizes) {
          try {
            await document.fonts.load(`${weight} ${size}px "${font.family}"`);
          } catch (e) {
            // Font loading failed, continue anyway
          }
        }
      }
    }
    
    // Wait for fonts to be fully applied
    if (document.fonts && document.fonts.check) {
      let allLoaded = false;
      let attempts = 0;
      while (!allLoaded && attempts < 10) {
        allLoaded = fontsToCheck.every(font => 
          font.weights.some(weight => 
            document.fonts.check(`${weight} 12px "${font.family}"`)
          )
        );
        if (!allLoaded) {
          await new Promise(resolve => setTimeout(resolve, 200));
          attempts++;
        }
      }
    }
    
    // Final wait for rendering
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const systems = [
    { name: 'GENIE', color: '#4ADE80', angle: 0 },
    { name: 'MIDAS', color: '#FBBF24', angle: 45 },
    { name: 'MAGICS', color: '#60A5FA', angle: 90 },
    { name: 'DIMES', color: '#A78BFA', angle: 135 },
    { name: 'AEGIS', color: '#F472B6', angle: 180 },
    { name: 'EUPHORIA', color: '#34D399', angle: 225 },
    { name: 'RETINA', color: '#FB923C', angle: 270 },
    { name: 'FENSO', color: '#818CF8', angle: 315 },
  ];

  const downloadAsPNG = async () => {
    setDownloading(true);
    try {
      // Wait for fonts to load first
      await waitForFonts();
      
      const html2canvas = (await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.min.js')).default;
      const element = invitationRef.current;
      
      // Temporarily set overflow to visible and get full height
      const originalOverflow = element.style.overflow;
      element.style.overflow = 'visible';
      
      // Wait for layout to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        height: element.scrollHeight,
        width: element.scrollWidth,
        fontEmbedCSS: true,
        onclone: (clonedDoc) => {
          // Ensure fonts are applied in cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Outfit:wght@300;400;500;600;700&display=block');
            * {
              font-family: 'Cormorant Garamond', 'Outfit', Georgia, serif, sans-serif !important;
            }
          `;
          clonedDoc.head.appendChild(style);
          
          // Force font loading in cloned document
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            const fontFamily = computedStyle.fontFamily;
            if (fontFamily && (fontFamily.includes('Cormorant') || fontFamily.includes('Outfit'))) {
              el.style.fontFamily = fontFamily;
            }
          });
        }
      });
      
      // Restore original overflow
      element.style.overflow = originalOverflow;
      const link = document.createElement('a');
      link.download = 'PhD_Colloquium_Invitation_Sankar.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      // Fallback method using canvas API
      const element = invitationRef.current;
      const rect = element.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      canvas.width = rect.width * 3;
      canvas.height = rect.height * 3;
      const ctx = canvas.getContext('2d');
      ctx.scale(3, 3);
      
      // Create SVG from HTML
      const data = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${element.outerHTML}
            </div>
          </foreignObject>
        </svg>
      `;
      const blob = new Blob([data], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = 'PhD_Colloquium_Invitation_Sankar.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
    setDownloading(false);
  };

  const downloadAsPDF = async () => {
    setDownloadingPDF(true);
    try {
      // Load html2canvas
      const html2canvas = (await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.esm.min.js')).default;
      
      // Load jsPDF via script tag (UMD bundle)
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      
      const { jsPDF } = window.jspdf;
      
      // Wait for fonts to load first
      await waitForFonts();
      
      const element = invitationRef.current;
      const scale = 2;
      
      // Temporarily set overflow to visible and get full height
      const originalOverflow = element.style.overflow;
      element.style.overflow = 'visible';
      
      // Wait for layout to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Extract all links before converting to canvas
      const links = element.querySelectorAll('a[href]');
      const linkData = Array.from(links).map(link => {
        const rect = link.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        return {
          href: link.href,
          x: rect.left - elementRect.left,
          y: rect.top - elementRect.top,
          width: rect.width,
          height: rect.height
        };
      });
      
      // Convert invitation to canvas
      const canvas = await html2canvas(element, {
        scale: scale,
        backgroundColor: null,
        useCORS: true,
        logging: false,
        height: element.scrollHeight,
        width: element.scrollWidth,
        fontEmbedCSS: true,
        onclone: (clonedDoc) => {
          // Ensure fonts are applied in cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Outfit:wght@300;400;500;600;700&display=block');
            * {
              font-family: 'Cormorant Garamond', 'Outfit', Georgia, serif, sans-serif !important;
            }
          `;
          clonedDoc.head.appendChild(style);
          
          // Force font loading in cloned document
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            const fontFamily = computedStyle.fontFamily;
            if (fontFamily && (fontFamily.includes('Cormorant') || fontFamily.includes('Outfit'))) {
              el.style.fontFamily = fontFamily;
            }
          });
        }
      });
      
      // Restore original overflow
      element.style.overflow = originalOverflow;
      
      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Create PDF with same dimensions as canvas
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [imgWidth, imgHeight]
      });
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Add clickable links to PDF
      linkData.forEach(link => {
        // Scale coordinates to match canvas/PDF dimensions
        const x = (link.x * scale);
        const y = (link.y * scale);
        const width = (link.width * scale);
        const height = (link.height * scale);
        
        // Add link annotation to PDF
        pdf.link(x, y, width, height, { url: link.href });
      });
      
      // Save PDF
      pdf.save('PhD_Colloquium_Invitation_Sankar.pdf');
    } catch (error) {
      console.error('PDF download error:', error);
      alert('Failed to generate PDF. Please try downloading as PNG instead.');
    }
    setDownloadingPDF(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      fontFamily: "'Cormorant Garamond', Georgia, serif"
    }}>
      
      {/* Invitation Card */}
      <div
        ref={invitationRef}
        style={{
          width: '700px',
          minHeight: '950px',
          background: 'linear-gradient(160deg, #fefce8 0%, #fef9e7 20%, #fdf4e3 40%, #fce7f3 70%, #f3e8ff 100%)',
          borderRadius: '24px',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        {/* Decorative Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '-80px',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        
        {/* Musical Staff Lines - Subtle Background */}
        <div style={{
          position: 'absolute',
          top: '120px',
          left: '0',
          right: '0',
          height: '60px',
          opacity: 0.06,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '0 30px',
        }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ height: '1px', background: '#1a1a2e' }} />
          ))}
        </div>

        {/* Logos Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* IISc Logo */}
          <div style={{
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img 
              src="/IIScLogoTransparent.png" 
              alt="IISc Logo"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              crossOrigin="anonymous"
            />
          </div>
          
          {/* Center Text */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '11px',
              letterSpacing: '3px',
              color: '#6b7280',
              margin: '0',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '400',
              textTransform: 'uppercase',
            }}>
              You are cordially invited to
            </p>
          </div>

          {/* Mechanical Engineering Logo */}
          <div style={{
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img 
              src="/MechIIScLogoTransparent.png"
              alt="Mechanical Engineering Logo"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* PhD Thesis Colloquium Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '18px',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '600',
            letterSpacing: '6px',
            color: '#4c1d95',
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
          }}>
            PhD Thesis Colloquium
          </h1>
          <div style={{
            width: '120px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)',
            margin: '0 auto',
          }} />
        </div>

        {/* Thesis Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: '26px',
            fontWeight: '600',
            color: '#1e1b4b',
            margin: '0',
            lineHeight: '1.35',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
          }}>
            An Active Ideation Framework using Creative Machines for Synergistic Human-AI Collaboration
          </h2>
        </div>

        {/* GEMINI Orbital Visualization */}
        <div style={{
          position: 'relative',
          width: '280px',
          height: '280px',
          margin: '20px auto 24px',
        }}>
          {/* Orbital Rings */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '240px',
            height: '240px',
            border: '1px dashed rgba(167,139,250,0.3)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            border: '1px solid rgba(167,139,250,0.15)',
            borderRadius: '50%',
          }} />
          
          {/* Center - GEMINI */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(30,27,75,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}>
            <span style={{
              color: '#fef3c7',
              fontSize: '13px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '700',
              letterSpacing: '1px',
            }}>GEMINI</span>
          </div>

          {/* Orbiting Systems */}
          {systems.map((system, index) => {
            const radius = 120;
            const angleRad = (system.angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;
            
            return (
              <div
                key={system.name}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  width: '42px',
                  height: '42px',
                  background: `linear-gradient(135deg, ${system.color} 0%, ${system.color}dd 100%)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 3px 12px ${system.color}50`,
                  border: '2px solid rgba(255,255,255,0.8)',
                }}
              >
                <span style={{
                  color: '#1e1b4b',
                  fontSize: '7px',
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: '700',
                  letterSpacing: '0.3px',
                }}>{system.name}</span>
              </div>
            );
          })}

          {/* Connecting Lines */}
          <svg style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}>
            {systems.map((system) => {
              const radius = 120;
              const angleRad = (system.angle * Math.PI) / 180;
              const x = 140 + Math.cos(angleRad) * radius;
              const y = 140 + Math.sin(angleRad) * radius;
              return (
                <line
                  key={system.name}
                  x1="140"
                  y1="140"
                  x2={x}
                  y2={y}
                  stroke={system.color}
                  strokeWidth="1"
                  opacity="0.3"
                />
              );
            })}
          </svg>
        </div>

        {/* Quote */}
        <div style={{
          textAlign: 'center',
          margin: '20px 40px 28px',
          position: 'relative',
          zIndex: 1,
        }}>
          <p style={{
            fontSize: '17px',
            fontStyle: 'italic',
            color: '#6b21a8',
            margin: '0',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: '500',
            lineHeight: '1.5',
          }}>
            "Where human dreams meet machine intelligence"
          </p>
        </div>

        {/* Shakespearean Invitation */}
        <div style={{
          textAlign: 'center',
          margin: '20px 40px 24px',
          position: 'relative',
          zIndex: 1,
          padding: '20px',
          background: 'rgba(167,139,250,0.06)',
          borderRadius: '16px',
          border: '1px solid rgba(167,139,250,0.15)',
        }}>
          <p style={{
            fontSize: '16px',
            fontStyle: 'italic',
            color: '#4c1d95',
            margin: '0 0 12px 0',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: '500',
            lineHeight: '1.6',
          }}>
            Art thou interested to read mine PhD<br />
            Like a Shakespearean novel, pray?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a 
              href="https://www.sankar-phd.in" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #4c1d95 0%, #6b21a8 100%)',
                borderRadius: '25px',
                textDecoration: 'none',
                boxShadow: '0 3px 12px rgba(76,29,149,0.3)',
                marginTop: '8px',
              }}
            >
              <span style={{ fontSize: '14px' }}>📖</span>
              <span style={{
                color: '#fef3c7',
                fontSize: '12px',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: '500',
              }}>sankar-phd.in</span>
            </a>
          </div>
        </div>

        {/* Presenter Info */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
          padding: '20px 0',
          borderTop: '1px solid rgba(167,139,250,0.2)',
          borderBottom: '1px solid rgba(167,139,250,0.2)',
          position: 'relative',
          zIndex: 1,
        }}>
          <p style={{
            fontSize: '12px',
            letterSpacing: '2px',
            color: '#6b7280',
            margin: '0 0 6px 0',
            fontFamily: "'Outfit', sans-serif",
            textTransform: 'uppercase',
          }}>Presented by</p>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1e1b4b',
            margin: '0 0 6px 0',
            fontFamily: "'Cormorant Garamond', Georgia, serif",
          }}>Sankar Balasubramanian</h3>
          <p style={{
            fontSize: '13px',
            color: '#6b7280',
            margin: '0',
            fontFamily: "'Outfit', sans-serif",
          }}>
            Research Advisor: <span style={{ fontWeight: '600', color: '#4c1d95' }}>Dr. Dibakar Sen</span>
          </p>
        </div>

        {/* Event Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Date */}
          <div style={{
            textAlign: 'center',
            padding: '16px 12px',
            background: 'rgba(167,139,250,0.08)',
            borderRadius: '12px',
          }}>
            <p style={{
              fontSize: '10px',
              letterSpacing: '2px',
              color: '#6b7280',
              margin: '0 0 6px 0',
              fontFamily: "'Outfit', sans-serif",
              textTransform: 'uppercase',
            }}>Date</p>
            <p style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e1b4b',
              margin: '0',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}>28<sup>th</sup> January<br /><span style={{ fontSize: '16px', fontWeight: '400' }}>Wednesday</span></p>
            <p style={{
              fontSize: '14px',
              color: '#4c1d95',
              margin: '2px 0 0 0',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '500',
            }}>2026</p>
          </div>

          {/* Time */}
          <div style={{
            textAlign: 'center',
            padding: '16px 12px',
            background: 'rgba(251,191,36,0.1)',
            borderRadius: '12px',
          }}>
            <p style={{
              fontSize: '10px',
              letterSpacing: '2px',
              color: '#6b7280',
              margin: '0 0 6px 0',
              fontFamily: "'Outfit', sans-serif",
              textTransform: 'uppercase',
            }}>Time</p>
            <p style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1e1b4b',
              margin: '0',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}>4:00 PM</p>
            <p style={{
              fontSize: '14px',
              color: '#92400e',
              margin: '2px 0 0 0',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '500',
            }}>IST</p>
          </div>

          {/* Venue */}
          <div style={{
            textAlign: 'center',
            padding: '16px 12px',
            background: 'rgba(52,211,153,0.1)',
            borderRadius: '12px',
          }}>
            <p style={{
              fontSize: '10px',
              letterSpacing: '2px',
              color: '#6b7280',
              margin: '0 0 6px 0',
              fontFamily: "'Outfit', sans-serif",
              textTransform: 'uppercase',
            }}>Venue</p>
            <p style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e1b4b',
              margin: '0',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}>Conference Room</p>
            <p style={{
              fontSize: '14px',
              color: '#047857',
              margin: '2px 0 0 0',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '500',
            }}>Dept of Mechanical Engineering</p>
          </div>
        </div>

        {/* Map Link */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '16px',
          position: 'relative',
          zIndex: 1,
        }}>
          <a 
            href="https://maps.app.goo.gl/2cH53RaJ9FVAJ6bQ8" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
              borderRadius: '25px',
              textDecoration: 'none',
              boxShadow: '0 3px 12px rgba(52,211,153,0.3)',
            }}
          >
            <span style={{ fontSize: '16px' }}>📍</span>
            <span style={{
              color: '#ffffff',
              fontSize: '12px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '500',
            }}>View on Map</span>
          </a>
        </div>

        {/* Address */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1,
        }}>
          <p style={{
            fontSize: '13px',
            color: '#4b5563',
            margin: '0',
            fontFamily: "'Outfit', sans-serif",
            lineHeight: '1.6',
          }}>
            Indian Institute of Science (IISc)<br />
            Bangalore - 560012, India
          </p>
        </div>

        {/* Links Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '16px',
          position: 'relative',
          zIndex: 1,
        }}>
          <p style={{
            fontSize: '13px',
            color: '#6b7280',
            margin: '0 0 12px 0',
            fontFamily: "'Outfit', sans-serif",
            fontStyle: 'italic',
          }}>
            To learn more about Sankar, feel free to explore:
          </p>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 1,
        }}>
          <a 
            href="https://www.sankar.studio" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              borderRadius: '25px',
              textDecoration: 'none',
              boxShadow: '0 3px 12px rgba(30,27,75,0.3)',
            }}
          >
            <span style={{ fontSize: '14px' }}>🌐</span>
            <span style={{
              color: '#fef3c7',
              fontSize: '12px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '500',
            }}>sankar.studio</span>
          </a>
          
          <a 
            href="https://www.linkedin.com/in/sankar4" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #0077b5 0%, #0a66c2 100%)',
              borderRadius: '25px',
              textDecoration: 'none',
              boxShadow: '0 3px 12px rgba(0,119,181,0.3)',
            }}
          >
            <span style={{ fontSize: '14px' }}>💼</span>
            <span style={{
              color: '#ffffff',
              fontSize: '12px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '500',
            }}>LinkedIn</span>
          </a>
        </div>

        {/* Contact */}
        <div style={{
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: '0',
            fontFamily: "'Outfit', sans-serif",
          }}>
            ✉️ sankarb@iisc.ac.in
          </p>
        </div>

        {/* Decorative Corner Elements */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '40px',
          height: '40px',
          borderTop: '2px solid rgba(167,139,250,0.3)',
          borderLeft: '2px solid rgba(167,139,250,0.3)',
        }} />
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          borderTop: '2px solid rgba(167,139,250,0.3)',
          borderRight: '2px solid rgba(167,139,250,0.3)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          width: '40px',
          height: '40px',
          borderBottom: '2px solid rgba(167,139,250,0.3)',
          borderLeft: '2px solid rgba(167,139,250,0.3)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          borderBottom: '2px solid rgba(167,139,250,0.3)',
          borderRight: '2px solid rgba(167,139,250,0.3)',
        }} />
      </div>

      {/* Download Buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '24px',
      }}>
        <button
          onClick={downloadAsPNG}
          disabled={downloading || downloadingPDF}
          style={{
            padding: '14px 32px',
            fontSize: '15px',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '500',
            color: '#1a1a2e',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
            border: 'none',
            borderRadius: '50px',
            cursor: (downloading || downloadingPDF) ? 'wait' : 'pointer',
            boxShadow: '0 4px 20px rgba(252, 211, 77, 0.3)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px'
          }}
          onMouseOver={(e) => {
            if (!downloading && !downloadingPDF) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 25px rgba(252, 211, 77, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 20px rgba(252, 211, 77, 0.3)';
          }}
        >
          {downloading ? '⏳ Generating...' : '⬇ Download as PNG'}
        </button>
        
        <button
          onClick={downloadAsPDF}
          disabled={downloading || downloadingPDF}
          style={{
            padding: '14px 32px',
            fontSize: '15px',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: '500',
            color: '#1a1a2e',
            background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
            border: 'none',
            borderRadius: '50px',
            cursor: (downloading || downloadingPDF) ? 'wait' : 'pointer',
            boxShadow: '0 4px 20px rgba(249, 168, 212, 0.3)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px'
          }}
          onMouseOver={(e) => {
            if (!downloading && !downloadingPDF) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 25px rgba(249, 168, 212, 0.4)';
            }
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 20px rgba(249, 168, 212, 0.3)';
          }}
        >
          {downloadingPDF ? '⏳ Generating...' : '📄 Download as PDF'}
        </button>
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
      `}</style>
    </div>
  );
};

export default ThesisInvitation;
